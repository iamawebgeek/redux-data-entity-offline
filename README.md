# redux-data-entity-offline
Additional library to connect [redux-data-entity](https://github.com/iamawebgeek/redux-data-entity) with [redux-offline](https://github.com/jevakallio/redux-offline)

## Usage

### Creating new offline data entity instance
```js
// e.g. entities/index.js
import { configureOfflineDataEntity } from 'redux-data-entity-offline'
import { Actions } from 'redux-data-entity'

import { fetchMyData } from './localUtils'

const createDataEntities = configureOfflineDataEntity(
  {
    process: (action, config, instanceConfig) => {
      // process function content
      // check out redux-data-entity package
    },
    // other options
  },
  {
    // optimistic requests with redux-offline are much preferred
    optimistic: true,
  },
)
export default createDataEntities({
  users: {
    endpoint: 'v1/user',
  },
  posts: {
    endpoint: 'v1/posts',
  },
  comments: {
    endpoint: 'v2/comments',
  }
})
```
### Configuring redux-offline
```js
import { createOfflineConfig } from 'redux-data-entity-offline'
// imports

const store = createStore(
  reducer,
  preloadedState,
  compose(
    applyMiddleware(middleware),
    offline(createOfflineConfig(myOfflineConfig))
  ),
)
export default store
```
### Using inside component
```js
// e.g. components/SomeDataComponent.js
import { Actions } from 'redux-data-entity'
import _ from 'lodash'

import entities from '../entities'

class SomeDataComponent extends Component {
  componentDidMount() {
    this.props.userActions(Actions.READ_MANY)
  }
  remove(key) {
    this.props.userOfflineActions(Actions.DELETE_ONE, {
      keys: [key]
    })
  }
  renderLoader() {
    return (
      <SomeActivityIndicator />
    )
  }
  renderContent() {
    return (
      <div>
        {_.map(this.props.users).map((user, key) => (
          <div>
            <span>{user.name}</span>
            <button onClick={() => this.remove(key)}>Delete</button>
          </div>
        ))}
      </div>
    )
  }
  render() {
    return (
      this.props.isLoadingUsers ? this.renderLoader() : this.renderContent()
    )
  }
}

const mapStateToProps = (state) => ({
  users: state.users,
  // note: any loading state getters should be inside state to props mapper
  isLoadingUsers: entities.users.isPerforming(READ_MANY),
})

const mapDispatchToProps = (dispatch) => ({
  userActions: entities.users.getActionHandler(dispatch),
  userOfflineActions: entities.users.getOfflineActionHandler(dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(SomeDataComponent)
```