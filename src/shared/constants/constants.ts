import { convertNumberToPrice } from "../lib";
import { type ISubscription } from "../types";

export const IMAGE_URL_MOCK =
  "https://sun9-13.userapi.com/impg/I5Yvt9zkYIfl1_Ctkg2k556EA1Db854kNK9aTg/0GWYlwf0-e8.jpg?size=1200x628&quality=96&sign=0dccfd830475562f97c17181aff94e93&c_uniq_tag=gYCV9LYKUkbvUC4cvovYT_rsXV3ILCIrffkYPjQa3N8&type=album";

export const SUBSCRIPTIONS_MOCK: ISubscription[] = [
  {
    title: "Базовый",
    description: "Бесплатный вариант подписки",
    price: convertNumberToPrice(0),
    level: 0,
  },
];
