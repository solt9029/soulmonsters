import React, { createContext, useCallback, useRef, useState } from 'react';

export type AttackAnimationParams = {
  attackerGameCardId: number;
  targetGameCardId: number | null;
  targetGameUserId: number | null;
};

type AttackAnimationContextValue = {
  animParams: AttackAnimationParams | null;
  isFlashing: boolean;
  startAttackAnimation: (params: AttackAnimationParams) => Promise<void>;
  onAnimationComplete: () => void;
};

export const AttackAnimationContext =
  createContext<AttackAnimationContextValue>({
    animParams: null,
    isFlashing: false,
    startAttackAnimation: async () => {},
    onAnimationComplete: () => {},
  });

export function AttackAnimationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [animParams, setAnimParams] = useState<AttackAnimationParams | null>(
    null
  );
  const [isFlashing, setIsFlashing] = useState(false);
  const resolveRef = useRef<(() => void) | null>(null);
  const flashTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const startAttackAnimation = useCallback(
    (params: AttackAnimationParams): Promise<void> => {
      return new Promise((resolve) => {
        resolveRef.current = resolve;

        flashTimeoutsRef.current.forEach(clearTimeout);
        flashTimeoutsRef.current = [
          setTimeout(() => setIsFlashing(true), 800),
          setTimeout(() => setIsFlashing(false), 1100),
        ];

        setAnimParams(params);
      });
    },
    []
  );

  const onAnimationComplete = useCallback(() => {
    setAnimParams(null);
    resolveRef.current?.();
    resolveRef.current = null;
  }, []);

  return (
    <AttackAnimationContext.Provider
      value={{
        animParams,
        isFlashing,
        startAttackAnimation,
        onAnimationComplete,
      }}
    >
      {children}
    </AttackAnimationContext.Provider>
  );
}
