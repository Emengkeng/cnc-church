'use client'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { Fragment, useEffect, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import AddOffering from "@/components/addOffering/AddOffering"

import { Montserrat } from "@next/font/google"
import { collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "@/lib/firebase"

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' })


export default function Offering() {

    let [isOpen, setIsOpen] = useState(false)

    function closeModal() {
        setIsOpen(false)   
    }

    function openModal() {
        setIsOpen(true)   
    }

    const [offeringData, setOfferingData] = useState<any>(null)

    const [deleteError, setDeleteError] = useState('')
    

    useEffect(() => {
        const fetchOfferingData = async () => {
            const offeringRef = collection(db, "offering")
            const offeringRefQuery = query(offeringRef, orderBy('date', 'desc'))
            const snapshots = await getDocs(offeringRefQuery)
            .then((snapshots) => {
              const docs = snapshots.docs.map((doc) =>{
                const data = doc.data()
                data.id = doc.id
                return data
              })
              console.log(docs)
                setOfferingData(docs)
              console.log('offering data', offeringData)
            })
        }
        fetchOfferingData()
      },[])

    function deleteHandler(id:string) {
        const docRef = doc(db, "offering", id)
        deleteDoc(docRef)
        .then(() => {
            console.log('deleted')
            // setDeleteError('')
            window.location.reload()
          })
          .catch((err) => {
            console.log(err)
            setDeleteError('Could not delete')
          })
    }

    return (
        <div className="flex flex-col justify-center py-10 px-40 flex-wrap w-[100%]">


<Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className={`${montserrat.variable} font-sans relative z-10 text-sm`} onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="text-left transform w-auto overflow-hidden rounded-2xl bg-white p-6 align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg text-center font-bold leading-6 text-gray-900"
                  >
                    Add Offering
                  </Dialog.Title>
                    <AddOffering/>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      
            <button className="text-white p-2 h-10 rounded w-40 bg-[#1A96FC]" onClick={() => setIsOpen(true)}>Add Offering</button>
            {
                      deleteError && 
                      
                      <div className={`text-center text-sm font-regular text-white bg-red-400 border p-1 rounded my-5`}>
                      <span>{deleteError}</span>
                      </div>  
                    }
            <table className='mt-10 table-auto border-separate border-spacing-[20px] text-[15px] w-[100%] flex-wrap text-sm'>
                <thead className='text-[#B2B2B2]'>
                <tr className='text-left'>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Members</th>
                    <th></th>
                </tr>
                </thead>
                {
                    offeringData ? 
                <tbody> 
                    
                   {
                    offeringData.map(data => (
                        <tr key={data.id}>
                            <td>{data.date}</td>
                            <td>{data.amount}</td>
                            <td>{data.members}</td>
                            <td><FontAwesomeIcon icon={faTrash} color='red' onClick={() => deleteHandler(data.id)} /></td>
                        </tr>
                    ))
                   }

                </tbody>

                : 

                <div className='mt-5 text-[#B2B2B2]'>
                <span>Loading offering data...</span>       
                </div>

                }
             
            </table>
        </div>
    )
}