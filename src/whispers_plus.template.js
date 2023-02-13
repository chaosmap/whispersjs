function state_report(whispersjs_object) {
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


function name_map() {
  return // PUT_INLINE_WHISPERSJS_SHORTHAND_NAME_MAP_HERE
}

function name_map_reversed() {
  const rev = {}
  for (let [key, val] of Object.entries(name_map())){
    rev[val] = key
  }
  return rev
}

function object_to_html(object, name_map) {
  const typo = typeof object;
  if (typo == 'object') {
    let child_el = document.createElement('dl')
    for (let [name, value] of Object.entries(object)) {
      let v = object_to_html(value, name_map)

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


deep_copy=(obj)=>{
  return JSON.parse(
    JSON.stringify(
      obj
    )
  )
};


