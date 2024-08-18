import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Profile } from "./components/Profile";
// import { ReelPage } from "./components/ReelPage"
import { ChatInterface } from "./components/ChatInterface2";
import Waitlist from "./components/Waitlist";
import WelcomePage from "./components/Welcome";
import Questions from "./components/Questions";
import DescQuestions from "./components/DescQuestion";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="gtu/profile" element={<Profile />} />
        <Route path="gtu/chat" element={<ChatInterface />} />
        <Route path="gtu/welcome/:name" element={<WelcomePage />} />
        <Route path="gtu/questions" element={<Questions />} />
        <Route path="gtu/next" element={<DescQuestions />} />

        {/* <Route path='/' element={<ReelPage />} /> */}
        <Route path="/" element={<Waitlist />} />
        <Route path="/home" element={<Waitlist />} />
      </Routes>
    </Router>
  );
}

export default App;
