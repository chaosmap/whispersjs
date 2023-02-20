WhispersJS = () => {
    let get_object_entries=Object.entries,
    get_unix_timestamp=Date.now,
    copy=(o)=>{
        return JSON.parse(JSON.stringify(o))
    },
    root_object = {
        topic_objects: {},
        subscriber_objects: {},
        instance_id: ((Date.now()*1e18)+Math.random()*1e15).toString(36),
        all_subscribers_ready: false,
        processing_in_progress: false,
        processing_scheduled: false,
        deep_copy: copy,
        process_topic_event: async (topic_name, event) => {
            // try processing with each subscriber, if any fail, try to store for later

            event['event_subscribers'] = event['event_subscribers'] || {};

            for (let [subscriber_name, subscriber_details] of get_object_entries(root_object.subscriber_objects[topic_name] || [])) {
                event['event_subscribers'][subscriber_name] = event['event_subscribers'][subscriber_name] || {
                    subscriber_success: false,
                    attempts: 0,
                    exceptions_count: 0
                    // persist: subscriber_details.persist
                }
            }

            let all_subscribers_successful = true;

            let processes = []

            for (let [subscriber_name, subscriber_details] of get_object_entries(event['event_subscribers'] || {})) {

                processes.push(
                    (
                        async () => {

                            let outcome;
                            if (subscriber_details.subscriber_success) {
                                outcome = true
                            } else {

                                subscriber_details.latest_attempt_start_ts = get_unix_timestamp();

                                try {
                                    outcome = await root_object.subscriber_objects[topic_name][subscriber_name].callback_function(event)===true;
                                } catch (caught_error) {
                                    outcome = false
                                    subscriber_details.exceptions_count++
                                    subscriber_details.latest_exception = JSON.stringify(caught_error)
                                }

                                subscriber_details.latest_attempt_end_ts = get_unix_timestamp();

                                subscriber_details.attempts++;
                                subscriber_details.first_attempt_start_ts = subscriber_details.first_attempt_start_ts || subscriber_details.latest_attempt_start_ts;
                            } 
                            subscriber_details.subscriber_success = outcome;
                            

                            all_subscribers_successful &= outcome
                        }
                    )()
                )
            }

            await Promise.allSettled(processes)

            event.all_subscribers_successful = all_subscribers_successful

            return event
            
        },

        process_topic_events: async () => {

            if (root_object.processing_in_progress) {
                // console.log('sorry, processing already in progress, try again later...')
                root_object.processing_scheduled = true
            } else {
                root_object.processing_in_progress = true;

                for (let [topic_name, topic_details] of get_object_entries(root_object.topic_objects)) {

                    let processes = []
                    for (let [key, event] of get_object_entries(topic_details.topic_events)) {
                        processes.push(
                            (
                                async ()=>{
                                    // console.log('processing')
                                    await root_object.process_topic_event(topic_name, event).then(
                                        new_event=>{
                                            if (new_event.all_subscribers_successful && root_object.all_subscribers_ready) {
                                                // yay, success, dont need topic_event event anymore
                                                delete topic_details.topic_events[key]
                                            }
                                        }
                                    )
                                }
                            )()
                        )
                    }
                    await Promise.allSettled(processes)
                }

                root_object.processing_in_progress = false;
                if (root_object.processing_scheduled) {
                    root_object.processing_scheduled = false;
                    root_object.process_topic_events()
                }
            }
        },

        publish_message: (topic_name, message) => {

            root_object.topic_objects[topic_name] = root_object.topic_objects[topic_name] || {
                event_count: 0,
                topic_events: {}
            }
            let id = `${root_object.instance_id}.${root_object.topic_objects[topic_name].event_count++}`
            root_object.topic_objects[topic_name].topic_events[id] = {
                id,
                created_ts: get_unix_timestamp(),
                message: copy(message)
            }

            root_object.process_topic_events()

        },

        subscribe_to_topic: (topic_name, subscriber_name, callback_function, persist) => {
            root_object.subscriber_objects[topic_name] = root_object.subscriber_objects[topic_name] || {}
            persist = persist === true

            root_object.subscriber_objects[topic_name][subscriber_name] = {
                callback_function: (event)=>{return callback_function(copy(event))},
                persist
            }

            root_object.publish_message(
                "#", 
                {
                    "e": "S",
                    topic_name,
                    subscriber_name,
                    persist
                }
            )

            root_object.process_topic_events()
        },

        set_subscribers_ready: () => {
            root_object.all_subscribers_ready=true
            root_object.publish_message("#", {"e":"R"})
        }
    }

    root_object.publish_message('#', {"e": "I"})

    return root_object
}

