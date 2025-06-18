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
        "https://lh3.googleusercontent.com/k23uZNlje2ER4DxaHKr_HSnd0slrRQHXk8BfhO2umxfzHUm0WiHZdXI71momtKrl9BkSIAjElb0HehDdzv98uCQxAUCJ84iyB5zTpuINGzL7-bpo-jvj1z3iiJ4pP-VQkC8o5PXBQlhFhSaCpMfHxLBzIJyTvBYz76BwsKvtRgFXqkHYMy901rK7E_xkLsF1_fXq0Cy51fVUZvIT9grXLQz3r1y_Ma9CigYPJWlt63gWTfM_yZSlqxXwflSMV9_r98EpZjtqwN-2hnYnWI29sOl62VjQiw__08vWxHz3Cj-5Tr5ioZbRxcyRcPZfRtC_l9OoCBiR2QrzRBJbQy7ieF7hcinSBk53vrXTLfPf-B1fSd7KzKl71O9k-9xcilNhzcc4xniIiHal5M8gl-nqV3EP7ytxfEMsFw03eyjd9O3RSVne0JBeb2oEyONqz0EPmrcau17hxz-piPpFozs8gw2mLOHvaG7CUuC1WWQqnp68vCTi5PRjYQWyIEIwZTuVhuQXMXuzuLpK9L76t-OwA4k5nUyubtrXRzzL1Zg0HVD3Z6fjw4c03DZ5wHlIG0CMN-lhCaJbe_8BB0rm9NQW1WjMpORz_xJfPtB-WPWAYt8uyheJ62ISEoNwUEed85KFys06j5K0lewrLXKyJyriRkSabyMnhRw9BoMScamRNhJVzMVB35NHF5hxsX9HUC1T4rImFTuzfHHM1YuttSe8fW-f5i7hYqcHOHvssBv39c_StQ0I6qJ3EZI=w500-h715-no"
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
        "https://lh3.googleusercontent.com/uYjzOEd05jKFgB91cQveSJGQE5U_F1lS4dHqdITsl3iAcvN_WcMsLUmmU6jxnla7k0zBv4cN4F7WWbUh4AR39UXPYM0_qeYmTQdTQo91vaXykgkT0in1eWrEtRMug4GVgd3ECrAoySFo2b2ORl3o71GmFQPLTnECHtHcGW9u_p9yv-5EUC5pv8_43TLBOO_uAryj6dMbxi4xvG0hlZYWZJ_noe_zegN_Mx-yu-ALu6H8Yj_rzV6meRNpGmNvUulMsS0Ic1Jn8iAJOb1jNRzoBdspYqLwF9ebsBelT2ydIsIZRuTIx6uOCCiXpN_bfX8CnX4btMQn9J5aK40zIWI60Yrnb617vsiy3MFZFGjHnJaH52me0HyIEfXk-vzI9kVIejbcXHtEZe0Hq_Phqx8edGGAfz8YQ-DUjruFhwvG83qKtMxvnQCnjtBKJ5lJdodv1APHGtihhE0OVIEmrpo8WRitvuMpU-XnKCxqv2QprTz0IX0Yst2LJn8Sn7dI7SHe00Zk7FeGYqitsqYFLw21va4TL8MHVKSBt2qibU5Swsx3jvbonQyk0urbHjojgdw7vp93tx-dJSxozyabLXzC5IORas_xktNWUt_zrztK4IY8Z1sNxUERYHq0rTpKkRBpxf4lU36BE5q-AMvrYrFqNRUegBPjqYrUTrpXiYrDEMYrBuK-6lYdBRjnOSeKrzvJZ7eZfoKgGOfbj_R1L0F3ypFdUILf5KblPPR9EDXhgRgiERYEy4nSM0I=w500-h715-no"
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
        "https://lh3.googleusercontent.com/_TwywpThKA7eHDdfU9O6j3veuXOznmlHq6Dh3vVht2PFK44P5RUiyUTtmg-1ty5W197W7E0UrFYd1KlWGKfkEHd8nUtVKDYvXFgHqTnoivCtNyigeONKHWIzQmgPR-g3fvsfk5uN96RnEg4cSZkraY5yddrCqiZY0PYVZPIxyhomvOaVvlwI7LmRz0Uh7LD_ZEIxxGwv8MvmVwQOUQ7szTuAlVE3_ATphtgwY7tZg2KL8H_IwQPgTZ9wrDJZkTcSvxeF7hCxaUoJLE9YsBSm5aIW4uGfcK4r9PT3ZD_t48hsCW1VUwNPHOv6l4uSMP_m_AL9BD2xpUB1L1U1hyMlFn3s6yxUiVuM0gMWuwwMwGQwaOziwVGJeJbyPgcst9pvKDXTnn1xqk90gQMJsxrQPqnRvfbLHSHame-kDHNWwlZJh2amuWOhLnT4jH7lvHpRQ0JttvX7k5rtIjVsife34ZQ1rdOjtjTS-DGexuCaYBbSKymHRTUowD1iuPQaMeiCL5RSJ2eFY46nOG4E-MBTLyIyjj1tT93M_P9WIQeLmVhhw-x-89mrg30_OaxeIG8eKa1jLbGI-EjNH3Q0k3-j9H71yO-DClMI-mt8I1YwXhTcoRu4ordabryLTLyu5sSt2298JPkRoHHsM93-6HZmL053OjDPtCqST8m1zLc9z0lkZr96kRdR79YyBvJg6mZ1DWT9BENpZqbUDm3a93leAQ_Juh3Aq-Ku_9xXiCaZhdwoSSbnUsIwxGU=w500-h715-no"
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
        "https://lh3.googleusercontent.com/sY5qrKrdQYNakOlTcPuv5m6dy5EJEqqfa1dqYDwh8lVseTO1DOwkVU9MCQ3YMsHsHSI7azX56jwaMMr7K9VeLIzrJ0NEZtu21kD085txpSYZ2pAKg-sAbtp3D4A4uBpB7A6GsCeHwODOoUOK4Va_GIWCRrpFQB3t0zGg6zZNUev0oWhLF-QP2UtG42RSY_sFZj-ACO3d8vqqoN_EG3hTFSZ4UtvdnYTHlltxJj6X-pONkfGpMD5QcotCkkyNEBbCqaw2NItpyDtHjjvPjQkQRlLvs-hXskX_kvzDCqH8iD-GK6GupPmaH0BCgbRUZMWrlNHu0iaTnWLtV-TWMNqswr9jwDKk_IGOOc4U0eMr_d_6hSSlWYanctZcHxAltraeZJj7VmsN2y6s9FKSzMvwX3yXoRw7FGKHD08o3JUuTp5uzWXStjpL_gdLvn_579yIpYXM4P2F11Psb685FPFr8pJkSge2KhkaBUyBVI0eAHFiBz87J3-zp9GuzbgL7weBKL6vnJhfo76Kx4Oy0nxUlTfHtlhWCp93Me0rSSmXw4uAtqshgdkjlGRi-j3OHr6m40iKY-y1RlGpt2iWfi1mquTn24mIVv0be8w4qAiHPRJJtqHXpo-_wvA6iUBOff374fu3oYDFL1OYl4n8pT3h72F4rVPrtCAhh0lR_MLMt2Cp3Tz0PsmWZjevBzGQDLX0bSXe44pFDYt4b3qNC1JSK-gdnk4DIyIfeuLfaJ5xsXYcIl1gRgkUyJE=w500-h715-no"
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
        "https://lh3.googleusercontent.com/pw/ACtC-3c_vpDDbjkMxQGTi775hHbMJd64WC6bmnUcWrzUike63NK5Pk1i7137-4Mgybrr-K2WZ2PjLIDfeQy1tH9n2ubll6QttANkX_xn1IiwATO33jkqxXsHFud8e5sm6jy7dbp7nuw8NTT-XDGOQ8SAhSblWg=w500-h715-no?authuser=0"
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
        "https://lh3.googleusercontent.com/pw/ACtC-3ex6FRzBJnI7fAHy4gDdFZV-Apj_FklVwDFfBmms5bhHRxy4acRQoWz3Lu4mAvaQJDCscuU1l4OtTtAXRKLz4RDWJQzaBSTz7P8lvXvCSpZOsw6clTlRGJ7MKW65lCupLAXVzsdT3h8SGoGAYV4W3wzOg=w500-h715-no?authuser=0"
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
        "https://lh3.googleusercontent.com/pw/ACtC-3dfaWOlzhjbywPk6iTahvugdfz5z87OflHR7D4SiWKisdv2-EpjP6eeSbOHyiutCr3PXSb6_pJMm4SuW-cNpX-rg-51vF6i2DCicQLfNgtC5TB4ep5_XQ8TUsQp9G2sCmexKD4ZjQCgJNu2t8Lm_wOEBw=w500-h715-no?authuser=0"
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
        "https://lh3.googleusercontent.com/pw/ACtC-3e_TwurBT8oL0wbI1qD8Vw6fkZrqu1xGbcEFb0kHH_JGXbLyh3oyOhSJb53C_kgtIBwlBWOIB1MANxe3Kv3Nu5d5HXlBfa4dYUF_sTSRVrkg8VQovzxWH65l1GzRx7M3seYi3AnMBb2Blu19e6gkhCEMw=w500-h715-no?authuser=0"
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
        "https://lh3.googleusercontent.com/pw/ACtC-3fYBIbiKUtwra6ITCJm5NHopp_v1N_wHpf_D9zpzKDn0XG8kfIZJDY1LYzWhkTjuDvVPftOXub95dspNS5FRzLNdOKkcSrbAlI8NcclUZD-p8-oBeBjmJwjDH9tNq5zygR3dJsQ1mckrw-AWq8WMGPxkA=w500-h715-no?authuser=0"
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
        "https://lh3.googleusercontent.com/pw/ACtC-3d88zSmuly2dZCr2w2Rpy5DkNVqNoDlsyeANFRoaaQ5v6jpBv7i92ZatsZCLRdWpyquDCW_0hPfpwSVdrEA9esVxXJtaAZ4v1VoXTUU4DlCrBCyCibmuXs8XKPQss7nH6o7woyxd6EXlBFG5A5qPwhmFw=w500-h715-no?authuser=0"
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
        "https://lh3.googleusercontent.com/pw/ACtC-3dNffWdGC-Ouoy24beRwhfkyRPtwTeE4p-VEtWhfSWsws4S8sJncB20iqqX3y44cj6s0H0aPFvYZsEMF8VVR8bwGI5TiiwUK_t2B7a2fsjhbFQfWlzOxipVISpkQC9Q2UjXq3Do4s3nB7At8v45KkShmw=w500-h715-no?authuser=0"
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
        "https://lh3.googleusercontent.com/pw/ACtC-3f6M6CIZ9WAAqA8yEWMgL170ZZQzU6EipvTZrFnGCpOtqWTTqtZl3Cazm--QjNTYOPkXC2ej-iYbCp38z-v5FmfXBNOd8vrQ1drVp--fy5bFZ27zF4VuxrqtxrIQGWdWIbUnB3f-uuGqYmb9SXxEiAIdg=w500-h715-no?authuser=0"
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
        "https://lh3.googleusercontent.com/pw/ACtC-3dpMKz6NrpopGg9eSfkH4BQJ3ymFI6cgxpznUOKtMao8OhVuVWigL6cTIkL29CbTByiDTBaVtLQ6ZzJF3Mlt4omNoS6nI6GQ4KAbWKzSMp1Yaxl1CeDqn0XuFmO6CKrEFnoR3aixqcKuJdkbKW0Bz4KXg=w500-h715-no?authuser=0"
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
        "https://lh3.googleusercontent.com/pw/ACtC-3dC2NP_S5BKACEkRdqLlGk_m_QBVJ7jJ7DR3qj2Y2Ky7S-VOL1rTUhYqNu6wuVXQFav8Gdc2b7WB-P-CebvRXVUW7cMClwpwm4AGxGjpdFidfCLZdLw2kJiBW6OfX4HG7Vvqc8NYvqiq10GyENgnPJSzA=w500-h715-no?authuser=0"
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
