export default async function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="form-layout space-y-4 text-center">
      <h3 className="form-heading">Invitation Not Found</h3>
      <p className="form-description description">{message} Please check again with the list owner.</p>
    </div>
  );
}