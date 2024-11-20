export class AppUtilities {
  static startsWith(value: string | null | undefined, startWith: string) {
    if (!value) return false;
    return value?.startsWith(startWith);
  }
}
