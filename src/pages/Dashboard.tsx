import React from "react"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import Overview from "@/components/dashboard/Overview"
import Studies from "@/components/dashboard/Studies"
import Users from "@/components/dashboard/Users"
import Payments from "@/components/dashboard/Payments"
import Documents from "@/components/dashboard/Documents"

const Dashboard = () => {
  const [activeSection, setActiveSection] = React.useState("#overview")

  const renderSection = () => {
    switch (activeSection) {
      case "#overview":
        return <Overview />
      case "#studies":
        return <Studies />
      case "#users":
        return <Users />
      case "#payments":
        return <Payments />
      case "#documents":
        return <Documents />
      default:
        return <Overview />
    }
  }

  return (
    <DashboardLayout>
      {renderSection()}
    </DashboardLayout>
  )
}

export default Dashboard