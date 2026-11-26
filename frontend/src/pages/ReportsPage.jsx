import { useParams } from 'react-router-dom'
import AuditReports from '../components/reports/AuditReports.jsx'
import ReportDetails from '../components/reports/ReportDetails.jsx'

export default function ReportsPage() {
  const { scanId } = useParams()
  return scanId ? <ReportDetails /> : <AuditReports />
}
