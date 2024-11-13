import { CheckCircle } from 'lucide-react'

const VerifiedBadge = () => {
  return (
    <span className="inline-flex items-center ml-1" title="Verified Organizer">
      <CheckCircle className="w-4 h-4 text-green-600" />
    </span>
  )
}

export default VerifiedBadge