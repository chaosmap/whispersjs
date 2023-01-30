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
  return {
	"subscriber_objects": "s",
	"topic_objects": "T",
	"process_topic_events": "I",
	"process_topic_event": "E",
	"subscribe_to_topic": "S",
	"publish_message": "P",
	"instance_id": "x",
    "processing_retry_ms": "Z",
    "all_subscribers_ready": "V",
    "set_subscribers_ready": "R",
    "processing_in_progress": "Y",
    "callback_function": "Q",
    "topic_events": "e",
    "event_count": "C",
	"event_subscribers": "W",
	"get_object_entries": "X",
	"persist": "U",
	"topic_name": "O",
	"processing_scheduled": "A",
	"latest_attempt_start_ts": "D",
	"first_attempt_start_ts": "F",
	"subscriber_success": "G",
	"attempts": "H",
	"latest_attempt_end_ts": "J",
	"latest_exception": "L",
	"exceptions_count": "M",
	"all_subscribers_successful": "N",
	"self": "B",
	"get_unix_timestamp": "q",
	"subscriber_name": "w",
	"created_ts": "f",
	"message": "m"



}
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


