
import React, { useState, useEffect, useCallback } from 'react';

import { AiFillCalendar } from "react-icons/ai";
import Search from "./components/Search";
import AddAppointment from "./components/AddAppointment";
/* import appointmentList from './data.json' */
import AppointmentInfo from "./components/AppointmentInfo";

function App() {

  const [appointmentList, setAppointmentList] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("petName");
  const [orderBy, setOrderby] = useState('asc');

  const filteredAppointments = appointmentList.filter(
    item => {
      return (
        item.petName.toString().toLowerCase().includes(query.toLowerCase()) ||
        item.ownerName.toString().toLowerCase().includes(query.toLowerCase()) ||
        item.aptNotes.toString().toLowerCase().includes(query.toLowerCase())
      )
    }
  ).sort((a, b) => {
    let order = (orderBy === 'asc') ? 1 : -1;
    return (
      a[sortBy].toLowerCase() < b[sortBy].toLowerCase()
        ? -1 * order : 1 * order
    )
  })


  const fetchData = useCallback(() => {
    fetch('./data.json')
      .then(response => response.json())
      .then(data => {
        setAppointmentList(data)
      });
  }, [])

  useEffect(() => {
    fetchData()

  }, [fetchData]);



  return (
    <div className="App container mx-auto mt-3 font-thin">
      <h1 className="text-5xl">
        <AiFillCalendar className="inline-block text-red-400 text-danger align-center mb-3" />
        Your Appointments</h1>
      <AddAppointment

        onSendAppointment={myAppointment => setAppointmentList([...appointmentList, myAppointment])}
        lastId={appointmentList.reduce((max, item) => Number(item.id) > max ? Number(item.id) : max, 0)}
      />
      <Search query={query}
        onQueryChange={myQuery => setQuery(myQuery)}
        orderBy={orderBy}
        onOrderbyChange={myQuery => setQuery(myQuery)}
        sortBy={sortBy}
        onSortByChange={mySort => setSortBy(mySort)}
      />

      <ul className="divide-y divide-gray-200">
        {filteredAppointments
          .map(appointment => (
            <AppointmentInfo key={appointment.id}
              appointment={appointment}
              onDeleteAppointment={
                appointmentId =>
                  setAppointmentList(appointmentList.filter(appointment =>
                    appointment.id !== appointmentId))
              }
            />
          ))
        }
      </ul>
    </div>
  );
}

export default App;
