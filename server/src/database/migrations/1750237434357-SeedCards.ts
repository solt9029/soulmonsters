import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedCards1750237434357 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(`
      INSERT INTO cards VALUES (
        1,
        "天気の神　ルテルテ改",
        "MONSTER",
        "CIRCLE",
        "BLUE",
        600,
        500,
        2,
        "◼1ターンに1度\n●エナジー1\nデッキからカードを1枚ドローする。",
        "https://res.cloudinary.com/dsicq6kw4/image/upload/v1753329559/Slide1_x2tnwu.jpg"
      )
    `);

    queryRunner.query(`
      INSERT INTO cards VALUES (
        2,
        "再復活したタキビー",
        "MONSTER",
        "TRIANGLE",
        "RED",
        1600,
        300,
        4,
        "◼このカードが相手を直接攻撃したとき\n相手ライフに1000ダメージを与える。",
        "https://res.cloudinary.com/dsicq6kw4/image/upload/v1753329757/Slide2_c5qdin.jpg"
      )
    `);

    queryRunner.query(`
      INSERT INTO cards VALUES (
        3,
        "スピードラゴン＆スピーバード",
        "MONSTER",
        "CIRCLE",
        "WHITE",
        0,
        0,
        0,
        "●ソウル3\n相手モンスター1枚の表示形式を変更する。",
        "https://res.cloudinary.com/dsicq6kw4/image/upload/v1753329757/Slide3_ccmtrz.jpg"
      )
    `);

    queryRunner.query(`
      INSERT INTO cards VALUES (
        4,
        "森の村長　エメラル",
        "MONSTER",
        "RECTANGLE",
        "GREEN",
        1200,
        1700,
        4,
        "◼1ターンに1度\n自分のエナジーを1増やす。",
        "https://res.cloudinary.com/dsicq6kw4/image/upload/v1753329757/Slide4_hiinsi.jpg"
      )
    `);

    queryRunner.query(`
      INSERT INTO cards VALUES (
        5,
        "ヘドロン",
        "MONSTER",
        "TRIANGLE",
        "PURPLE",
        1000,
        600,
        3,
        "●ソウル3\n自分のモルグゾーンに置かれている紫属性モンスター1枚をバトルゾーンに置く。",
        "https://res.cloudinary.com/dsicq6kw4/image/upload/v1753329758/Slide5_l7gxxb.jpg"
      )
    `);

    queryRunner.query(`
      INSERT INTO cards VALUES (
        6,
        "さらにみずみずしい魚",
        "MONSTER",
        "RECTANGLE",
        "BLUE",
        200,
        300,
        1,
        "■1ターンに1度\n●ソウル3\nデッキからカードを2枚ドローする。",
        "https://res.cloudinary.com/dsicq6kw4/image/upload/v1753329758/Slide6_n62lgc.jpg"
      )
    `);

    queryRunner.query(`
      INSERT INTO cards VALUES (
        7,
        "進化したバクボムダン",
        "MONSTER",
        "TRIANGLE",
        "RED",
        1500,
        600,
        4,
        "■バトルゾーンからソウルゾーンに置かれたとき\n相手ライフに600のダメージを与える。",
        "https://res.cloudinary.com/dsicq6kw4/image/upload/v1753329758/Slide7_bcoywh.jpg"
      )
    `);

    queryRunner.query(`
      INSERT INTO cards VALUES (
        8,
        "懐かしのルード",
        "MONSTER",
        "CIRCLE",
        "WHITE",
        300,
        300,
        1,
        "●エナジー2\n相手モンスター1枚の攻撃力をこのターンのエンドタイムまで700下げる。",
        "https://res.cloudinary.com/dsicq6kw4/image/upload/v1753329759/Slide8_at8pfg.jpg"
      )
    `);

    queryRunner.query(`
      INSERT INTO cards VALUES (
        9,
        "ハモンタキーに狩られぬもの",
        "MONSTER",
        "RECTANGLE",
        "GREEN",
        200,
        700,
        2,
        "■ソウルゾーンに置かれた時\n自分のモルグゾーンに置かれている□族モンスター1枚をソウルゾーンに置く。",
        "https://res.cloudinary.com/dsicq6kw4/image/upload/v1753329759/Slide9_h7s8i8.jpg"
      )
    `);

    queryRunner.query(`
      INSERT INTO cards VALUES (
        10,
        "スーパーニューボルツ",
        "MONSTER",
        "TRIANGLE",
        "PURPLE",
        1500,
        800,
        4,
        "■1ターンに1度\n●自分のデッキの上からカードを1枚\n相手モンスター1枚をモルグゾーンに置く。",
        "https://res.cloudinary.com/dsicq6kw4/image/upload/v1753329759/Slide10_e508r0.jpg"
      )
    `);

    queryRunner.query(`
      INSERT INTO cards VALUES (
        11,
        "冷徹な鳥",
        "MONSTER",
        "TRIANGLE",
        "BLUE",
        600,
        300,
        2,
        "■このカードが相手を直接攻撃したとき\nカードを2枚ドローする。",
        "https://res.cloudinary.com/dsicq6kw4/image/upload/v1753329760/Slide11_aegljb.jpg"
      )
    `);

    queryRunner.query(`
      INSERT INTO cards VALUES (
        12,
        "相変わらずよく分からない花",
        "MONSTER",
        "TRIANGLE",
        "RED",
        1600,
        0,
        4,
        "■モルグゾーンに置かれたとき\n相手ライフに600のダメージを与える。",
        "https://res.cloudinary.com/dsicq6kw4/image/upload/v1753329760/Slide12_h7ez5q.jpg"
      )
    `);

    queryRunner.query(`
      INSERT INTO cards VALUES (
        13,
        "シマシマジュニア",
        "MONSTER",
        "RECTANGLE",
        "GREEN",
        500,
        900,
        3,
        "■バトルゾーンに置かれたとき\n相手のエナジーを1減らし、自分のエナジーを1増やす。",
        "https://res.cloudinary.com/dsicq6kw4/image/upload/v1753329760/Slide13_x0m0df.jpg"
      )
    `);

    queryRunner.query(`
      INSERT INTO cards VALUES (
        14,
        "ニセキサンチョウ",
        "MONSTER",
        "CIRCLE",
        "WHITE",
        1000,
        800,
        3,
        "■バトルゾーンからソウルゾーンに置かれたとき\n自分のエナジーを2増やす。",
        "https://res.cloudinary.com/dsicq6kw4/image/upload/v1753329761/Slide14_hodo7p.jpg"
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // do nothing
  }
}
