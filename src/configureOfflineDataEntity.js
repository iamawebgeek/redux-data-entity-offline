import { configureDataEntity, States } from 'redux-data-entity'
import _ from 'lodash'

export default function configureOfflineDataEntity(globalEntityConfig, globalActionConfig) {
  const baseDataEntityCreator = configureDataEntity(globalEntityConfig, globalActionConfig)
  return function (entities) {
    const entityInstances = baseDataEntityCreator(entities)
    _.forEach(entityInstances, (value) => {
      function getOfflineActionHandler(dispatch) {
        return function (action, config, meta) {
          config = { ...value.getActionConfig(), ...config }
          if (config.force || value.shouldRequest(action, config)) {
            const dataEntity = { config }
            const instanceConfig = value.getConfig()
            dispatch({
              type: value.getConst(action, States.START),
              meta: {
                ...meta,
                dataEntity,
                offline: {
                  commit: {
                    type: value.getConst(action, States.SUCCESS),
                    meta: { ...meta, dataEntity },
                  },
                  rollback: {
                    type: value.getConst(action, States.FAIL),
                    meta: { ...meta, dataEntity },
                  },
                  effect: (effectAction = action, effectConfig = config) => instanceConfig.process(effectAction, effectConfig, instanceConfig),
                },
              },
            })
          }
        }
      }
      value.getOfflineActionHandler = getOfflineActionHandler
    })
    return entityInstances
  }
}