wspr.state_report = (whispersjs_object) => {
  const report = {
    instance_id: whispersjs_object.instance_id,
    topics: {},
    subscribers: {}
  }
  for (let [topic_name, topic_object] of Object.entries(whispersjs_object.topic_objects)) {
    report.topics[topic_name] = {
        events_total: topic_object.event_count,
        subscribers_with_errors: []
    }
    let events_unprocessed = 0;
    for (let [event_id, event] of Object.entries(topic_object.topic_events)) {
      events_unprocessed += event.all_subscribers_successful? 0 : 1;
      for (let [subscriber_name, subscriber_details] of Object.entries(event.event_subscribers)) {
        !subscriber_details.subscriber_success && subscriber_details.latest_exception ? report.topics[topic_name].subscribers_with_errors.push(subscriber_name) : 0;
        
        if (!subscriber_details.subscriber_success) {

          report.subscribers[subscriber_name] = report.subscribers[subscriber_name] || {}
          report.subscribers[subscriber_name][topic_name] = report.subscribers[subscriber_name][topic_name] || {
            unprocessed_events: 0,
            exceptions: {}
          }

          report.subscribers[subscriber_name][topic_name].unprocessed_events++

          if (subscriber_details.exceptions) {
            report.subscribers[subscriber_name][topic_name].exceptions[subscriber_details.latest_exception] = report.subscribers[subscriber_name][topic_name].exceptions[subscriber_details.latest_exception] || 0;
            report.subscribers[subscriber_name][topic_name].exceptions[subscriber_details.latest_exception]++
          }
        }  
      }
      report.topics[topic_name].events_processed = report.topics[topic_name].events_total - events_unprocessed
      report.topics[topic_name].events_unprocessed = events_unprocessed

    }
  }

  return JSON.parse(JSON.stringify(report))
}


wspr.name_map = ()=>{
  return {"subscriber_objects": "subscriber_objects", "topic_objects": "topic_objects", "process_topic_events": "process_topic_events", "process_topic_event": "process_topic_event", "subscribe_to_topic": "subscribe_to_topic", "publish_message": "publish_message", "instance_id": "instance_id", "processing_retry_ms": "processing_retry_ms", "all_subscribers_ready": "all_subscribers_ready", "set_subscribers_ready": "set_subscribers_ready", "processing_in_progress": "processing_in_progress", "callback_function": "callback_function", "topic_events": "topic_events", "event_count": "event_count", "event_subscribers": "event_subscribers", "get_object_entries": "get_object_entries", "persist": "persist", "topic_name": "topic_name", "processing_scheduled": "processing_scheduled", "latest_attempt_start_ts": "latest_attempt_start_ts", "first_attempt_start_ts": "first_attempt_start_ts", "subscriber_success": "subscriber_success", "attempts": "attempts", "latest_attempt_end_ts": "latest_attempt_end_ts", "latest_exception": "latest_exception", "exceptions_count": "exceptions_count", "all_subscribers_successful": "all_subscribers_successful", "self": "self", "get_unix_timestamp": "get_unix_timestamp", "subscriber_name": "subscriber_name", "created_ts": "created_ts", "message": "message"}
}

wspr.name_map_reversed = ()=>{
  const rev = {}
  for (let [key, val] of Object.entries(wspr.name_map())){
    rev[val] = key
  }
  return rev
}

wspr.object_to_html = (object, name_map)=>{
  const typo = typeof object;
  if (typo == 'object') {
    let child_el = document.createElement('dl')
    for (let [name, value] of Object.entries(object)) {
      let v = wspr.object_to_html(value, name_map)

      if (v !== undefined) {

        let dt = document.createElement('dt')
        
        dt.innerText = name_map[name] || name;

        let dd = document.createElement('dd')
        dd.appendChild(v)

        child_el.appendChild(dt)
        child_el.appendChild(dd)


      }
    }
    return child_el
  } else if (typo == 'function') {
    return undefined
  } else if (
    typo == 'number' ||
    typo == 'boolean' ||
    typo == 'string'
  ) {
    let child_el = document.createElement('span')
    child_el.innerText = object==="" ? "(not set)" : object
    return child_el
  } else {
    let child_el = document.createElement('span')
    child_el.innerText = typo
    return child_el
  }
}


wspr.deep_copy=(obj)=>{
  return JSON.parse(
    JSON.stringify(
      obj
    )
  )
};


// This function allows you to submit to whispersjs what subscribers you expect
// and to automatically call the subscribers ready function once they have all subscribed.
// expected_subscribers are expected to be submitted in the following format
// {
//       '[topic_name]': ['expected_subscriber_name_1', 'expected_subscriber_name_2'],
//       '[another_topic_name': ['expected_subscriber_name_1', 'expected_subscriber_name_2']
// }
wspr.set_expected_subscribers = (expected_subscribers) => {
  for (const key of Object.keys(expected_subscribers)) {
    expected_subscribers[key] = new Set(expected_subscribers[key])
  }
  wspr.unsubscribed_expected_subscribers = expected_subscribers;

  const check_topic_and_subscriber = (topic, subscriber_name) => {
    if (wspr.unsubscribed_expected_subscribers[topic]) {
      if (wspr.unsubscribed_expected_subscribers[topic].has(subscriber_name)) {
        wspr.unsubscribed_expected_subscribers[topic].delete(subscriber_name)
      }
      if (wspr.unsubscribed_expected_subscribers[topic].size == 0) {
        delete wspr.unsubscribed_expected_subscribers[topic]
      }
    }
    if (!wspr.all_subscribers_ready && Object.keys(wspr.unsubscribed_expected_subscribers).length == 0 ) {
      wspr.set_subscribers_ready()
    }
  }

  wspr.subscribe_to_topic(
    '#',
    'subscribers_ready_check',
    (event) => {
      if (event.message.e == 'S') {
        check_topic_and_subscriber(
          event.message.topic_name,
          event.message.subscriber_name
        )
      }
      return true;
    }
  )
}