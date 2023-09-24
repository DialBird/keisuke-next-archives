export const InfiniteScrollListItem = ({ entry }: { entry: any }) => {
  return (
    <div className="border-b p-4 border-black">
      <p>
        {entry.id}: {entry.name}
      </p>
    </div>
  )
}
