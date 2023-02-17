WhispersJS = () => {
    let X=Object.entries,
    q=Date.now,
    copy=(o)=>{
        return JSON.parse(JSON.stringify(o))
    },
    root_object = {
        T: {},
        s: {},
        x: Math.floor(Math.random()*1000000000000000000),
        V: false,
        Y: false,
        A: false,
        c: copy,
        E: async (O, event) => {
            // try processing with each subscriber, if any fail, try to store for later

            event['W'] = event['W'] || {};

            for (let [w, subscriber_details] of X(root_object.s[O] || [])) {
                event['W'][w] = event['W'][w] || {
                    G: false,
                    H: 0,
                    M: 0
                    // U: subscriber_details.U
                }
            }

            let N = true;

            let processes = []

            for (let [w, subscriber_details] of X(event['W'] || {})) {

                processes.push(
                    (
                        async () => {

                            let outcome;
                            if (subscriber_details.G) {
                                outcome = true
                            } else {

                                subscriber_details.D = q();

                                try {
                                    outcome = await root_object.s[O][w].Q(event)===true;
                                } catch (caught_error) {
                                    outcome = false
                                    subscriber_details.M++
                                    subscriber_details.L = JSON.stringify(caught_error)
                                }

                                subscriber_details.J = q();

                                subscriber_details.H++;
                                subscriber_details.F = subscriber_details.F || subscriber_details.D;
                            } 
                            subscriber_details.G = outcome;
                            

                            N &= outcome
                        }
                    )()
                )
            }

            await Promise.allSettled(processes)

            event.N = N

            return event
            
        },

        I: async () => {

            if (root_object.Y) {
                // console.log('sorry, processing already in progress, try again later...')
                root_object.A = true
            } else {
                root_object.Y = true;

                for (let [O, topic_details] of X(root_object.T)) {

                    let processes = []
                    for (let [key, event] of X(topic_details.e)) {
                        processes.push(
                            (
                                async ()=>{
                                    // console.log('processing')
                                    await root_object.E(O, event).then(
                                        new_event=>{
                                            if (new_event.N && root_object.V) {
                                                // yay, success, dont need topic_event event anymore
                                                delete topic_details.e[key]
                                            }
                                        }
                                    )
                                }
                            )()
                        )
                    }
                    await Promise.allSettled(processes)
                }

                root_object.Y = false;
                if (root_object.A) {
                    root_object.A = false;
                    root_object.I()
                }
            }
        },

        P: (O, m) => {

            root_object.T[O] = root_object.T[O] || {
                C: 0,
                e: {}
            }
            let id = `${root_object.x}.${root_object.T[O].C++}`
            root_object.T[O].e[id] = {
                id,
                f: q(),
                m: copy(m)
            }

            root_object.I()

        },

        S: (O, w, Q, U) => {
            root_object.s[O] = root_object.s[O] || {}
            U = U === true

            root_object.s[O][w] = {
                Q: (event)=>{return Q(copy(event))},
                U
            }

            root_object.P(
                "#", 
                {
                    "e": "S",
                    O,
                    w,
                    U
                }
            )

            root_object.I()
        },

        R: () => {
            root_object.V=true
            root_object.P("#", {"e":"R"})
        }
    }

    root_object.P('#', {"e": "I"})

    return root_object
}

