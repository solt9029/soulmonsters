import { Record } from 'immutable';

export interface DeckModalDataInterface {
  isInDeck: boolean;
  picture: string;
  cardId: number;
}

export interface DeckModalInterface {
  data: DeckModalDataInterface;
  isOpen: boolean;
}

export default class DeckModal extends Record<DeckModalInterface>(
  {
    data: {
      isInDeck: false,
      picture:
        'https://lh3.googleusercontent.com/k23uZNlje2ER4DxaHKr_HSnd0slrRQHXk8BfhO2umxfzHUm0WiHZdXI71momtKrl9BkSIAjElb0HehDdzv98uCQxAUCJ84iyB5zTpuINGzL7-bpo-jvj1z3iiJ4pP-VQkC8o5PXBQlhFhSaCpMfHxLBzIJyTvBYz76BwsKvtRgFXqkHYMy901rK7E_xkLsF1_fXq0Cy51fVUZvIT9grXLQz3r1y_Ma9CigYPJWlt63gWTfM_yZSlqxXwflSMV9_r98EpZjtqwN-2hnYnWI29sOl62VjQiw__08vWxHz3Cj-5Tr5ioZbRxcyRcPZfRtC_l9OoCBiR2QrzRBJbQy7ieF7hcinSBk53vrXTLfPf-B1fSd7KzKl71O9k-9xcilNhzcc4xniIiHal5M8gl-nqV3EP7ytxfEMsFw03eyjd9O3RSVne0JBeb2oEyONqz0EPmrcau17hxz-piPpFozs8gw2mLOHvaG7CUuC1WWQqnp68vCTi5PRjYQWyIEIwZTuVhuQXMXuzuLpK9L76t-OwA4k5nUyubtrXRzzL1Zg0HVD3Z6fjw4c03DZ5wHlIG0CMN-lhCaJbe_8BB0rm9NQW1WjMpORz_xJfPtB-WPWAYt8uyheJ62ISEoNwUEed85KFys06j5K0lewrLXKyJyriRkSabyMnhRw9BoMScamRNhJVzMVB35NHF5hxsX9HUC1T4rImFTuzfHHM1YuttSe8fW-f5i7hYqcHOHvssBv39c_StQ0I6qJ3EZI=w500-h715-no',
      cardId: 1,
    },
    isOpen: false,
  },
  'DeckModal'
) {
  open(data: DeckModalDataInterface): DeckModal {
    return new DeckModal({ data, isOpen: true });
  }
  close(): DeckModal {
    return this.set('isOpen', false);
  }
}
