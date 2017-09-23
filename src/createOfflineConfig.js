export default function createOfflineConfig(baseConfig = {}) {
  return {
    ...baseConfig,
    effect: (effect, action) => {
      return effect()
    }
  }
}