import { useContext, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AttackAnimationContext } from '../../../contexts/AttackAnimationContext';
import { AppContext } from '../../../contexts/AppContext';
import {
  type GameCardFragment,
  Zone,
} from '../../../graphql/generated/graphql-client';

const CARD_SPACING = 1.6;
const DECK_SIDE_BOUNDARY = 3.0;

const ZONE_CENTERS: Partial<Record<string, [number, number, number]>> = {
  [`${Zone.Battle}_player`]: [0, 0, 2],
  [`${Zone.Battle}_opponent`]: [0, 0, -2],
  [`${Zone.Hand}_player`]: [0, 0, 7.75],
  [`${Zone.Hand}_opponent`]: [0, 0, -7.75],
  [`${Zone.Soul}_player`]: [0, 0, 5],
  [`${Zone.Soul}_opponent`]: [0, 0, -5],
};

function getCardPosition(
  gameCardId: number,
  gameCards: GameCardFragment[],
  currentUserUid: string
): THREE.Vector3 {
  const card = gameCards.find((gc) => gc.id === gameCardId);
  if (!card) return new THREE.Vector3(0, 0.5, 0);

  const isYours = card.currentUserId === currentUserUid;
  const key = `${card.zone}_${isYours ? 'player' : 'opponent'}`;
  const center = ZONE_CENTERS[key] ?? [0, 0, 0];

  const zoneCards = gameCards
    .filter(
      (gc) => gc.zone === card.zone && gc.currentUserId === card.currentUserId
    )
    .sort((a, b) => b.position - a.position); // ZoneCards3D と同じ降順ソート
  const count = zoneCards.length;
  const cardIndex = zoneCards.findIndex((gc) => gc.id === gameCardId);

  const deckSideDirection = isYours ? 1 : -1;
  const naturalHalfSpread = ((count - 1) / 2) * CARD_SPACING;
  const overshoot =
    card.zone === Zone.Battle || card.zone === Zone.Soul
      ? Math.max(0, naturalHalfSpread - DECK_SIDE_BOUNDARY)
      : 0;
  const effectiveCenterX = center[0] - deckSideDirection * overshoot;
  const offsetX = (cardIndex - (count - 1) / 2) * CARD_SPACING;

  return new THREE.Vector3(effectiveCenterX + offsetX, 0.6, center[2]);
}

// タイミング定数 (秒)
const T_CHARGE_END = 0.35;
const T_TRAVEL_END = 0.85;
const T_IMPACT_END = 1.6;

export type AttackAnimationEffectProps = {
  gameCards: GameCardFragment[];
};

export default function AttackAnimationEffect({
  gameCards,
}: AttackAnimationEffectProps) {
  const { animParams, onAnimationComplete } = useContext(
    AttackAnimationContext
  );
  const {
    state: { user },
  } = useContext(AppContext);

  const startTimeRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const prevAnimParamsRef = useRef<typeof animParams>(null);

  const chargeRing1Ref = useRef<THREE.Mesh>(null!);
  const chargeRing2Ref = useRef<THREE.Mesh>(null!);
  const orbCoreRef = useRef<THREE.Mesh>(null!);
  const orbGlowRef = useRef<THREE.Mesh>(null!);
  const shockwave1Ref = useRef<THREE.Mesh>(null!);
  const shockwave2Ref = useRef<THREE.Mesh>(null!);
  const impactFlashRef = useRef<THREE.Mesh>(null!);
  const attackerGlowRef = useRef<THREE.Mesh>(null!);

  const attackerPosRef = useRef(new THREE.Vector3());
  const targetPosRef = useRef(new THREE.Vector3());

  const allRefs = [
    chargeRing1Ref,
    chargeRing2Ref,
    orbCoreRef,
    orbGlowRef,
    shockwave1Ref,
    shockwave2Ref,
    impactFlashRef,
    attackerGlowRef,
  ];

  useFrame(({ clock }) => {
    const isPlaying = animParams !== null;

    if (!isPlaying) {
      if (prevAnimParamsRef.current !== null) {
        allRefs.forEach((r) => {
          if (r.current) r.current.visible = false;
        });
        startTimeRef.current = null;
        completedRef.current = false;
      }
      prevAnimParamsRef.current = null;
      return;
    }

    // 新しいアニメーション開始時に初期化
    if (prevAnimParamsRef.current !== animParams) {
      prevAnimParamsRef.current = animParams;
      startTimeRef.current = clock.elapsedTime;
      completedRef.current = false;

      const uid = user.data?.uid ?? '';
      attackerPosRef.current = getCardPosition(
        animParams.attackerGameCardId,
        gameCards,
        uid
      );
      if (animParams.targetGameCardId !== null) {
        targetPosRef.current = getCardPosition(
          animParams.targetGameCardId,
          gameCards,
          uid
        );
      } else {
        // 直接攻撃: 相手側プレイヤーの方向
        targetPosRef.current = new THREE.Vector3(0, 1, -9);
      }
    }

    if (completedRef.current) return;

    const t = clock.elapsedTime - (startTimeRef.current ?? clock.elapsedTime);
    const ap = attackerPosRef.current;
    const tp = targetPosRef.current;

    // ===== チャージフェーズ (0 ~ T_CHARGE_END) =====
    if (t < T_CHARGE_END) {
      const p = t / T_CHARGE_END;

      // 攻撃カード周囲の光輪 (外側)
      if (chargeRing1Ref.current) {
        chargeRing1Ref.current.visible = true;
        chargeRing1Ref.current.position.set(ap.x, 0.08, ap.z);
        const s1 = THREE.MathUtils.lerp(0.3, 3.5, p);
        chargeRing1Ref.current.scale.setScalar(s1);
        const op1 = p < 0.5 ? p * 2 * 0.85 : (1 - p) * 2 * 0.85;
        (chargeRing1Ref.current.material as THREE.MeshBasicMaterial).opacity =
          op1;
      }

      // 攻撃カード周囲の光輪 (内側)
      if (chargeRing2Ref.current) {
        chargeRing2Ref.current.visible = true;
        chargeRing2Ref.current.position.set(ap.x, 0.12, ap.z);
        const s2 = THREE.MathUtils.lerp(0.15, 1.8, p);
        chargeRing2Ref.current.scale.setScalar(s2);
        (chargeRing2Ref.current.material as THREE.MeshBasicMaterial).opacity =
          p * 0.7;
      }

      // 攻撃カードのオーラ (チャージ中に強くなる)
      if (attackerGlowRef.current) {
        attackerGlowRef.current.visible = true;
        attackerGlowRef.current.position.set(ap.x, 0.06, ap.z);
        (attackerGlowRef.current.material as THREE.MeshBasicMaterial).opacity =
          p * 0.6 + 0.1 * Math.sin(clock.elapsedTime * 12);
      }

      if (orbCoreRef.current) orbCoreRef.current.visible = false;
      if (orbGlowRef.current) orbGlowRef.current.visible = false;
    } else {
      if (chargeRing1Ref.current) chargeRing1Ref.current.visible = false;
      if (chargeRing2Ref.current) chargeRing2Ref.current.visible = false;
      if (attackerGlowRef.current) attackerGlowRef.current.visible = false;
    }

    // ===== 飛翔フェーズ (T_CHARGE_END ~ T_TRAVEL_END) =====
    if (t >= T_CHARGE_END && t < T_TRAVEL_END) {
      const raw = (t - T_CHARGE_END) / (T_TRAVEL_END - T_CHARGE_END);
      // ease-in-out cubic
      const p =
        raw < 0.5 ? 4 * raw * raw * raw : 1 - Math.pow(-2 * raw + 2, 3) / 2;

      const x = THREE.MathUtils.lerp(ap.x, tp.x, p);
      const z = THREE.MathUtils.lerp(ap.z, tp.z, p);
      const arc = Math.sin(raw * Math.PI) * 2.2;
      const y = THREE.MathUtils.lerp(ap.y, tp.y, p) + arc;

      if (orbCoreRef.current) {
        orbCoreRef.current.visible = true;
        orbCoreRef.current.position.set(x, y, z);
        const pulse = 1.0 + 0.25 * Math.sin(clock.elapsedTime * 30);
        orbCoreRef.current.scale.setScalar(pulse);
      }

      if (orbGlowRef.current) {
        orbGlowRef.current.visible = true;
        orbGlowRef.current.position.set(x, y, z);
        const glowPulse = 1.8 + 0.4 * Math.sin(clock.elapsedTime * 20);
        orbGlowRef.current.scale.setScalar(glowPulse);
        (orbGlowRef.current.material as THREE.MeshBasicMaterial).opacity =
          0.35 + 0.15 * Math.sin(clock.elapsedTime * 20);
      }
    } else if (t >= T_TRAVEL_END) {
      if (orbCoreRef.current) orbCoreRef.current.visible = false;
      if (orbGlowRef.current) orbGlowRef.current.visible = false;
    }

    // ===== 衝撃フェーズ (T_TRAVEL_END ~ T_IMPACT_END) =====
    if (t >= T_TRAVEL_END && t < T_IMPACT_END) {
      const p = (t - T_TRAVEL_END) / (T_IMPACT_END - T_TRAVEL_END);

      // 白いフラッシュ球体 (膨張 → 収縮・消滅)
      if (impactFlashRef.current) {
        impactFlashRef.current.visible = true;
        impactFlashRef.current.position.set(tp.x, tp.y, tp.z);
        const flashScale =
          p < 0.12
            ? 1 + (p / 0.12) * 3.5
            : Math.max(0, 4.5 - ((p - 0.12) / 0.88) * 4.5);
        impactFlashRef.current.scale.setScalar(flashScale);
        (impactFlashRef.current.material as THREE.MeshBasicMaterial).opacity =
          Math.max(0, 1 - p * 1.1);
      }

      // 衝撃波リング1 (大・高速展開)
      if (shockwave1Ref.current) {
        shockwave1Ref.current.visible = true;
        shockwave1Ref.current.position.set(tp.x, 0.06, tp.z);
        const sw1 = 0.5 + p * 14;
        shockwave1Ref.current.scale.setScalar(sw1);
        (shockwave1Ref.current.material as THREE.MeshBasicMaterial).opacity =
          Math.max(0, 1 - p * 1.4);
      }

      // 衝撃波リング2 (遅れて展開、オレンジ)
      const p2 = Math.max(
        0,
        (t - T_TRAVEL_END - 0.12) / (T_IMPACT_END - T_TRAVEL_END - 0.12)
      );
      if (shockwave2Ref.current) {
        shockwave2Ref.current.visible = p2 > 0;
        shockwave2Ref.current.position.set(tp.x, 0.12, tp.z);
        const sw2 = 0.3 + p2 * 9;
        shockwave2Ref.current.scale.setScalar(sw2);
        (shockwave2Ref.current.material as THREE.MeshBasicMaterial).opacity =
          Math.max(0, 0.85 - p2 * 1.1);
      }
    } else if (t >= T_IMPACT_END) {
      if (impactFlashRef.current) impactFlashRef.current.visible = false;
      if (shockwave1Ref.current) shockwave1Ref.current.visible = false;
      if (shockwave2Ref.current) shockwave2Ref.current.visible = false;
    }

    // アニメーション完了
    if (t >= T_IMPACT_END && !completedRef.current) {
      completedRef.current = true;
      onAnimationComplete();
    }
  });

  if (!animParams) return null;

  return (
    <>
      {/* チャージリング1 (外側 ゴールド) */}
      <mesh
        ref={chargeRing1Ref}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
      >
        <ringGeometry args={[0.32, 0.52, 40]} />
        <meshBasicMaterial color="#ffaa00" transparent opacity={0} />
      </mesh>

      {/* チャージリング2 (内側 オレンジ) */}
      <mesh
        ref={chargeRing2Ref}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
      >
        <ringGeometry args={[0.2, 0.38, 40]} />
        <meshBasicMaterial color="#ff6600" transparent opacity={0} />
      </mesh>

      {/* 攻撃カードオーラ (カードサイズの平面グロー) */}
      <mesh
        ref={attackerGlowRef}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
      >
        <planeGeometry args={[1.6, 2.2]} />
        <meshBasicMaterial
          color="#ff8800"
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      {/* エネルギーオーブ (コア) */}
      <mesh ref={orbCoreRef} visible={false}>
        <sphereGeometry args={[0.22, 18, 18]} />
        <meshBasicMaterial color="#ff3300" />
      </mesh>

      {/* エネルギーオーブ (グロー) */}
      <mesh ref={orbGlowRef} visible={false}>
        <sphereGeometry args={[0.22, 18, 18]} />
        <meshBasicMaterial
          color="#ffaa00"
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>

      {/* 衝撃フラッシュ球体 */}
      <mesh ref={impactFlashRef} visible={false}>
        <sphereGeometry args={[0.55, 20, 20]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={1}
          depthWrite={false}
        />
      </mesh>

      {/* 衝撃波リング1 (白→薄白) */}
      <mesh ref={shockwave1Ref} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[0.28, 0.48, 40]} />
        <meshBasicMaterial
          color="#ffeecc"
          transparent
          opacity={1}
          depthWrite={false}
        />
      </mesh>

      {/* 衝撃波リング2 (オレンジ) */}
      <mesh ref={shockwave2Ref} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[0.22, 0.4, 40]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}
