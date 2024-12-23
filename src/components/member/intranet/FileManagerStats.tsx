interface FileManagerStatsProps {
  totalDocuments: number
  usedSpace: string
  lastUpdate: string
}

export default function FileManagerStats({
  totalDocuments,
  usedSpace,
  lastUpdate,
}: FileManagerStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <h3 className="font-semibold mb-2">Documents partagés</h3>
        <p className="text-2xl font-bold">{totalDocuments}</p>
      </div>
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <h3 className="font-semibold mb-2">Espace utilisé</h3>
        <p className="text-2xl font-bold">{usedSpace}</p>
      </div>
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <h3 className="font-semibold mb-2">Dernière mise à jour</h3>
        <p className="text-2xl font-bold">{lastUpdate}</p>
      </div>
    </div>
  )
}