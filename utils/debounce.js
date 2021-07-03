let debounce = (fn, wait) => {
  let timer,
    startTimeStamp = 0
  let context, args

  let run = (timerInterval) => {
    timer = setTimeout(() => {
      let now = new Date().getTime()
      let interval = now - startTimeStamp
      if (interval < timerInterval) {
        // the timer start time has been reset, so the interval is less than timerInterval
        console.log('debounce reset', timerInterval - interval)
        startTimeStamp = now
        run(wait - interval) // reset timer for left time
      } else {
        fn.apply(context, args)
        clearTimeout(timer)
        timer = null
      }
    }, timerInterval)
  }

  return function () {
    context = this
    args = arguments
    let now = new Date().getTime()
    startTimeStamp = now

    if (!timer) {
      console.log('debounce set', wait)
      run(wait) // last timer alreay executed, set a new timer
    }
  }
}
export default debounce
