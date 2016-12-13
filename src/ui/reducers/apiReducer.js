import {
    API_SUBSCRIBE,
    API_UNSUBSCRIBE,
    API_DATA,
    API_FAILURE,
} from '../actions/apiActions'


export default function configuration(state = {
    subscriptions: {},
    data:          {},
    errors:        {},
}, action) {
    let subscriptions

    switch (action.type) {
        case API_SUBSCRIBE:
            subscriptions = { ...state.subscriptions }
            if (!subscriptions[action.subscription.id]) {
                subscriptions[action.subscription.id] = {
                    ...action.subscription,
                    subscriptionCount: 0,
                }
            }
            subscriptions[action.subscription.id].subscriptionCount += 1

            return {
                ...state,
                subscriptions,
            }

        case API_UNSUBSCRIBE:
            if (!state.subscriptions[action.id]) {
                return state
            }

            subscriptions = { ...state.subscriptions }
            const subscription  = { ...subscriptions[action.id] }
            if (subscription.subscriptionCount > 1) {
                subscriptions = {
                    ...subscriptions,
                    [subscription.id]: {
                        ...subscription,
                        subscriptionCount: subscription.subscriptionCount - 1,
                    }
                }
            } else {
                delete subscriptions[subscription.id]
            }

            return {
                ...state,
                subscriptions,
            }

        case API_DATA:
            let errors = { ...state.errors }
            delete errors[action.id]

            return {
                ...state,
                data: {
                    ...state.data,
                    [action.id]: action.data,
                },
                errors,
            }

        case API_FAILURE:
            return {
                ...state,
                errors: {
                    ...state.errors,
                    [action.id]: action.data,
                }
            }

        default:
            return state
    }
}
