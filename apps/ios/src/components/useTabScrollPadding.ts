import { useSafeAreaInsets } from "react-native-safe-area-context";

import { space } from "../theme/tokens";

const TAB_BAR_CLEARANCE = 88;

export function useTabScrollPadding(extra = 0) {
  const insets = useSafeAreaInsets();
  return insets.bottom + TAB_BAR_CLEARANCE + extra;
}

export function useScreenPadding() {
  const insets = useSafeAreaInsets();
  return {
    paddingTop: insets.top + 12,
    paddingBottom: insets.bottom + TAB_BAR_CLEARANCE,
    paddingHorizontal: space.lg,
    gap: 20,
  };
}
