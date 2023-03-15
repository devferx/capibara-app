import { createSignal, onMount, createEffect, For } from 'solid-js'

import logo from './assets/carpincho.png'

function App() {
  const [capibaraList, setCapibaraList] = createSignal([])
  const [status, setStatus] = createSignal('idle')
  const [error, setError] = createSignal(null)
  const [page, setPage] = createSignal(1)

  const fetchCapibaraList = async (page) => {
    setStatus('loading')
    try {
      const resp = await fetch(
        `https://api.capy.lol/v1/capybaras?from=${
          20 * (page - 1) + 1
        }&take=${20}`
      )
      const { data } = await resp.json()
      setCapibaraList(data)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err.message)
    }
  }

  createEffect(() => {
    fetchCapibaraList(page())
  })

  onMount(() => {
    fetchCapibaraList(page())
  })

  return (
    <div>
      <header class="flex flex-col items-center justify-center gap-3 rounded-b-2xl bg-indigo-100 py-12">
        <img src={logo} alt="Logo" />
        <h1 class="text-4xl font-extrabold">CapibarApp</h1>
        <p class="font-semibold">Find the best capibara in the world</p>
      </header>

      {status() === 'loading' ? (
        <div class="mt-4 flex flex-col items-center">
          <p class="text-2xl font-bold">Loading...</p>
        </div>
      ) : null}

      {status() === 'success' ? (
        <section class="container mx-auto my-4 flex flex-col items-center">
          <div class="lg grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            <For each={capibaraList()}>
              {(capibara) => (
                <img
                  class="h-full rounded object-cover"
                  src={capibara.url}
                  alt={capibara.alt}
                />
              )}
            </For>
          </div>
          <div class="mt-4 flex gap-4">
            <button
              class="rounded-md bg-indigo-500 px-4 py-2 text-white disabled:opacity-50"
              onClick={() => setPage(page() - 1)}
              disabled={page() === 1}
            >
              Previous
            </button>
            <button
              class="rounded-md bg-indigo-500 px-4 py-2 text-white"
              onClick={() => setPage(page() + 1)}
            >
              Next
            </button>
          </div>
        </section>
      ) : null}

      {status() === 'error' ? (
        <div class="mt-4 flex flex-col items-center">
          <p class="text-2xl font-bold">
            🤔 Uhh... the capybaras ran very fast 💨
          </p>
          <p>{error()}</p>
        </div>
      ) : null}

      <footer class="flex flex-col items-center justify-center gap-3 rounded-t-2xl bg-indigo-100 py-12">
        <p class="text-center ">
          Made with ❤️ by{' '}
          <a
            class="text-indigo-500 hover:text-indigo-700"
            href="https://github.com/devferx"
            target="_blank"
            rel="noreferrer"
          >
            @devferx
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App
