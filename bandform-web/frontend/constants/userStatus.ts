import { UserStatus } from "../gql/graphql";

export type UserStatusOption = {
  value: UserStatus;
  label: string;
  description: string;
};

export const NOT_IN_BAND_STATUS_OPTIONS: UserStatusOption[] = [
  {
    value: "NOBANDRAND",
    label: "Auto-match me",
    description:
      "You can be automatically placed into a new band by the band randomizer — no approval needed each time.",
  },
  {
    value: "NOBANDSEL",
    label: "Let me choose",
    description:
      "You'll only join a band by sending or accepting a request or invite yourself.",
  },
];

export const IN_BAND_STATUS_OPTIONS: UserStatusOption[] = [
  {
    value: "BAND",
    label: "Not looking",
    description:
      "You're set on your current band and don't want to be matched elsewhere.",
  },
  {
    value: "BANDRAND",
    label: "Auto-match me",
    description:
      "You can be automatically placed into another band by the randomizer.",
  },
  {
    value: "BANDSEL",
    label: "Let me choose",
    description:
      "You're open to joining another band, but only via a request or invite you approve.",
  },
];
