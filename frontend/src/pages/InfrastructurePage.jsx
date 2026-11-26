import UploadSnapshot from '../components/infrastructure/UploadSnapshot.jsx'
import Header from '../components/layout/Header.jsx'

export default function InfrastructurePage() {
  return (
    <div className="animate-fade-in">
      <Header
        title="Connect Infrastructure"
        subtitle="Upload a JSON configuration snapshot to run a security audit against your cloud environment."
      />
      <UploadSnapshot />
    </div>
  )
}
