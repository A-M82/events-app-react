import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import EventsList from "./pages/EventsList";
import EventDetails from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
 
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/sign-in" replace />} />
 
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/sign-in" element={<SignIn />} />
 
      <Route path="/events" element={<EventsList />} />
      <Route path="/events/create" element={<CreateEvent />} />
      <Route path="/events/:id" element={<EventDetails />} />
    </Routes>
  );
}
 
export default App;
 