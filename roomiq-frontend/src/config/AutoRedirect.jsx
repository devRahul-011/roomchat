function RequireVisit({ children }) {
  const { hasVisitedLogin } = useAppContext();

  // If hasVisitedLogin is false or undefined, redirect to the home page
  if (!hasVisitedLogin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RequireVisit;