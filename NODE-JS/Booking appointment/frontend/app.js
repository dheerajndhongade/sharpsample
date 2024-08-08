document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = "http://localhost:8000/appointments";
  let appointments = [];

  const appointmentForm = document.getElementById("appointmentForm");
  const appointmentList = document.getElementById("appointmentList");

  async function fetchAppointments() {
    try {
      const response = await fetch(apiUrl);
      appointments = await response.json();
      renderAppointments();
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  }

  function renderAppointments() {
    appointmentList.innerHTML = "";
    appointments.forEach((appointment, index) => {
      const li = document.createElement("li");
      li.textContent = ` Username: ${appointment.username}, Phone: ${appointment.phone}, Email: ${appointment.email}`;
      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.onclick = () => editAppointment(appointment.id);
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.onclick = () => deleteAppointment(appointment.id);
      li.appendChild(editButton);
      li.appendChild(deleteButton);
      appointmentList.appendChild(li);
    });
  }

  async function addOrUpdateAppointment(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;

    const appointmentData = { username, phone, email };
    const index = appointmentForm.dataset.index;
    try {
      if (index) {
        await fetch(`${apiUrl}/${index}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(appointmentData),
        });
        delete appointmentForm.dataset.index;
      } else {
        await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(appointmentData),
        });
      }
      appointmentForm.reset();
      fetchAppointments();
    } catch (error) {
      console.error("Error adding/updating appointment:", error);
    }
  }

  async function editAppointment(id) {
    try {
      const response = await fetch(`${apiUrl}/${id}`);
      const appointment = await response.json();
      console.log(appointment);
      document.getElementById("username").value = appointment.username;
      document.getElementById("phone").value = appointment.phone;
      document.getElementById("email").value = appointment.email;
      appointmentForm.dataset.index = id;
    } catch (error) {
      console.error("Error fetching appointment for edit:", error);
    }
  }

  async function deleteAppointment(id) {
    try {
      await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
      fetchAppointments();
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  }

  appointmentForm.addEventListener("submit", addOrUpdateAppointment);

  fetchAppointments();
});
