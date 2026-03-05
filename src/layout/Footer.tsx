export default function Footer() {
  return (
    <footer style={{ padding: '1rem', borderTop: '1px solid #ccc', textAlign: 'center' }}>
      &copy; {new Date().getFullYear()} tg-web
    </footer>
  );
}
