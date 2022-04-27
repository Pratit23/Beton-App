import React from 'react'

const stateMachine = {
    initial: 'initial',
    states : {
        initial: { on: { next: 'ready'} },
        ready: { on: { next: 'classifying', previous: 'initial'}},
        classifying: { on: { next: 'location', previous: 'initial'} },
        details: { on: { next: 'location', previous: 'initial'} },
        location: { on: { next: 'complete', previous: 'initial'} },
        complete: { on: { next: 'success', previous: 'initial'}},
        success: { on: { next: 'awaitingUpload'}},
    }
}

const reducer = (currentState, e) => stateMachine.states[currentState].on[e] || stateMachine.initial

export { stateMachine, reducer }