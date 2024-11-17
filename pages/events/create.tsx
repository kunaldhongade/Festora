import { createEvent } from '@/services/blockchain'
import { EventParams } from '@/utils/type.dt'
import { NextPage } from 'next'
import Head from 'next/head'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'react-toastify'
import { useAccount } from 'wagmi'

const Page: NextPage = () => {
  const { address } = useAccount()
  const [event, setEvent] = useState<EventParams>({
    title: '',
    imageUrl: '',
    description: '',
    ticketCost: '',
    capacity: '',
    startsAt: '',
    endsAt: '',
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEvent((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!address) return toast.warn('Connect wallet first')

    event.startsAt = new Date(event.startsAt).getTime()
    event.endsAt = new Date(event.endsAt).getTime()

    await toast.promise(
      new Promise(async (resolve, reject) => {
        createEvent(event)
          .then((tx) => {
            console.log(tx)
            resetForm()
            resolve(tx)
          })
          .catch((error) => reject(error))
      }),
      {
        pending: 'Approve transaction...',
        success: 'Event creation successful 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const resetForm = () => {
    setEvent({
      title: '',
      imageUrl: '',
      description: '',
      ticketCost: '',
      capacity: '',
      startsAt: '',
      endsAt: '',
    })
  }

  return (
    <div>
      <Head>
        <title>Event X | Create</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="lg:w-2/3 w-full mx-auto bg-gray-50 p-8 shadow-md rounded-lg">
        <div className="flex flex-row justify-between items-center mb-5">
          <p className="font-semibold text-xl">Create Event</p>
        </div>
        {event.imageUrl && (
          <div className="flex justify-center items-center mb-5">
            <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-112 xl:h-128 rounded-xl overflow-hidden shadow-md">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col text-black space-y-5">
          <div className="flex flex-row justify-between items-center bg-slate-100 rounded-xl p-4">
            <input
              className="block w-full text-sm bg-transparent border-0 focus:outline-none focus:ring-0"
              type="text"
              name="title"
              placeholder="Title"
              value={event.title}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center w-full space-x-0 sm:space-x-4 space-y-5 sm:space-y-0">
            <div className="w-full bg-slate-100 rounded-xl p-4">
              <input
                className="block w-full text-sm bg-transparent border-0 focus:outline-none focus:ring-0"
                type="number"
                step={1}
                min={1}
                name="capacity"
                placeholder="Capacity"
                value={event.capacity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="w-full bg-slate-100 rounded-xl p-4">
              <input
                className="block w-full text-sm bg-transparent border-0 focus:outline-none focus:ring-0"
                type="number"
                step="0.01"
                min="0.01"
                name="ticketCost"
                placeholder="Ticket cost (ETH)"
                value={event.ticketCost}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex flex-row justify-between items-center bg-slate-100 rounded-xl p-4">
            <input
              className="block w-full text-sm bg-transparent border-0 focus:outline-none focus:ring-0"
              type="url"
              name="imageUrl"
              placeholder="ImageURL"
              pattern="https?://.+(\.(jpg|png|gif))?$"
              value={event.imageUrl}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center w-full space-x-0 sm:space-x-4 space-y-5 sm:space-y-0">
            <div className="w-full bg-slate-100 rounded-xl p-4">
              <input
                placeholder="Start Date"
                className="bg-transparent outline-none w-full placeholder-[#3D3857] text-sm border-none focus:outline-none focus:ring-0 py-0"
                name="startsAt"
                type="datetime-local"
                value={event.startsAt}
                onChange={handleChange}
                required
              />
            </div>

            <div className="w-full bg-slate-100 rounded-xl p-4">
              <input
                placeholder="End Date"
                className="bg-transparent outline-none w-full placeholder-[#3D3857] text-sm border-none focus:outline-none focus:ring-0 py-0"
                name="endsAt"
                type="datetime-local"
                value={event.endsAt}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex flex-row justify-between items-center bg-slate-100 rounded-xl p-4">
            <textarea
              className="block w-full text-sm resize-none bg-transparent border-0 focus:outline-none focus:ring-0 h-20"
              name="description"
              placeholder="Description"
              value={event.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="mt-5 flex justify-center">
            <button
              type="submit"
              className="bg-orange-500 py-3 px-10 rounded-full text-white hover:bg-transparent border hover:text-orange-500 hover:border-orange-500 duration-300 transition-all text-xl"
            >
              Submit
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default Page
