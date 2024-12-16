import { Routes, Route } from "react-router-dom"
import MemberSidebar from "./MemberSidebar"
import StudyDetailsPage from "./studies/StudyDetailsPage"
import Dashboard from "./Dashboard"
import CurrentStudies from "./studies/CurrentStudies"
import NewStudy from "./studies/NewStudy"
import Documents from "../dashboard/Documents"
import Settings from "./Settings"
import MissionsList from "./missions/MissionsList"

const MemberSpace = () => {
  return (
    <div className="flex">
      <MemberSidebar />
      <div className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/current-studies" element={<CurrentStudies />} />
          <Route path="/current-studies/:studyId" element={<StudyDetailsPage />} />
          <Route path="/studies/new" element={<NewStudy />} />
          <Route path="/missions" element={<MissionsList />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  )
}

export default MemberSpace