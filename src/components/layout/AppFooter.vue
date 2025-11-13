<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Formular Manager</h3>
          <p>Ein leistungsstarkes Tool zur Erstellung und Verwaltung von Gruppenanmeldeformularen.</p>
        </div>
        
        <div class="footer-section">
          <h4>Links</h4>
          <ul class="footer-links">
            <li><router-link to="/">Startseite</router-link></li>
            <li><router-link to="/forms">Meine Formulare</router-link></li>
            <li><router-link to="/help">Hilfe</router-link></li>
            <li><router-link to="/privacy">Datenschutz</router-link></li>
            <li><router-link to="/imprint">Impressum</router-link></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>Kontakt</h4>
          <p>Bei Fragen oder Problemen wenden Sie sich bitte an den Support.</p>
          <a href="mailto:support@example.com" class="contact-email">support@example.com</a>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Formular Manager. Alle Rechte vorbehalten.</p>
        <div class="footer-lang">
          <span>Sprache:</span>
          <select class="lang-select">
            <option value="de">Deutsch</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background-color: #f5f7fa;
  color: #4a5568;
  padding: 3rem 0 1.5rem;
  margin-top: 3rem;
  border-top: 1px solid #e2e8f0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3,
.footer-section h4 {
  color: #2d3748;
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.footer-section p {
  margin: 0.5rem 0;
  line-height: 1.6;
  color: #4a5568;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: #4a5568;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: var(--ct-color-primary);
  text-decoration: underline;
}

.contact-email {
  display: inline-block;
  margin-top: 0.5rem;
  color: var(--ct-color-primary);
  text-decoration: none;
}

.contact-email:hover {
  text-decoration: underline;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
  font-size: 0.9rem;
  color: #718096;
}

.footer-lang {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.lang-select {
  padding: 0.25rem 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background-color: white;
  font-size: 0.9rem;
  color: #4a5568;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
