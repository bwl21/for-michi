<template>
  <div class="not-found">
    <div class="error-container">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>Sorry, the page you are looking for doesn't exist or has been moved.</p>
      <router-link to="/" class="home-link">
        Go to Home
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  text-align: center;
  padding: 2rem;
}

.error-container {
  max-width: 500px;
  margin: 0 auto;
}

h1 {
  font-size: 6rem;
  margin: 0;
  color: #42b983;
  line-height: 1;
}

h2 {
  font-size: 2rem;
  margin: 0.5rem 0 1rem;
  color: #2c3e50;
}

p {
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.home-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.home-link:hover {
  background-color: #3aa876;
}
</style>
