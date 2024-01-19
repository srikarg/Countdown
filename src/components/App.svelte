<script lang="ts">
  export let count: number
  let message: string = null

  const increment = () => (count += 1)
  const decrement = () => (count -= 1)

  const handleSave = () => {
    chrome.storage.sync.set({ count }).then(() => {
      message = 'Updated!'

      setTimeout(() => {
        message = null
      }, 2000)
    })
  }
</script>

<div class="prose prose-lg prose-slate mx-auto p-6 font-sans">
  <h1 class="text-4xl">Countdown</h1>

  <p>
    Keep track of your most important future events with a countdown on the new
    tab page!
  </p>

  <button class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
    >Add Event</button
  >
  <button class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
    >Delete All Events</button
  >

  <form class="my-4 space-y-4">
    <div>
      <label for="event-title" class="block font-bold">Event Title</label>
      <input
        type="text"
        id="event-title"
        class="rounded border border-blue-700 px-4 py-2.5 text-base"
        maxlength="25"
        required
      />
    </div>

    <div>
      <label for="event-date" class="block font-bold">Event Date</label>
      <input
        type="date"
        id="event-date"
        class="rounded border border-blue-700 px-4 py-2.5 text-base"
        required
      />
    </div>

    <div>
      <label class="block">
        <input type="checkbox" id="enterTime" />
        <span class="label-body">Do you want to enter a time as well?</span>
      </label>
    </div>

    <div>
      <label for="event-time" class="block font-bold">Event Time</label>
      <input
        type="time"
        id="event-time"
        class="rounded border border-blue-700 px-4 py-2.5 text-base"
      />
    </div>

    <button
      type="submit"
      class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
    >
      Track It!
    </button>
  </form>

  <ul class=""></ul>
</div>
