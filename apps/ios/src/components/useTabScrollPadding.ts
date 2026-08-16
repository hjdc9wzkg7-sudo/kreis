import { useSafeAreaInsets } from "react-native-safe-area-context";

const TAB_BAR_CLEARANCE = 88;

export function useTabScrollPadding(extra = 0) {
  const insets = useSafeAreaInsets();
  return insets.bottom + TAB_BAR_CLEARANCE + extra;
}
