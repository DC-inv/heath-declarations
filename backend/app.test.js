require('dotenv').config();
const request = require('supertest');

const baseURL = process.env.TEST_BASE_URL;

describe('Health Declarations API', () => {
  describe('GET /api/health-declarations', () => {
    it('should return all health declarations', async () => {
      const response = await request(baseURL)
        .get('/api/health-declarations')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/health-declarations', () => {
    it('should create a new health declaration with valid data', async () => {
      const newDeclaration = {
        name: 'Username',
        temperature: 36.5,
        symptoms: false,
        covidContact: false
      };

      const response = await request(baseURL)
        .post('/api/health-declarations')
        .send(newDeclaration)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', 'Username');
      expect(response.body).toHaveProperty('temperature', 36.5);
      expect(response.body).toHaveProperty('symptoms', false);
      expect(response.body).toHaveProperty('covidContact', false);
      expect(response.body).toHaveProperty('submittedAt');
      
      expect(new Date(response.body.submittedAt)).toBeInstanceOf(Date);
    });

    it('should return 400 when name is missing', async () => {
      const invalidDeclaration = {
        temperature: 36.5,
        symptoms: false
      };

      const response = await request(baseURL)
        .post('/api/health-declarations')
        .send(invalidDeclaration)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Name and temperature are required');
    });

    it('should return 400 when temperature is missing', async () => {
      const invalidDeclaration = {
        name: 'Username',
        symptoms: true
      };

      const response = await request(baseURL)
        .post('/api/health-declarations')
        .send(invalidDeclaration)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Name and temperature are required');
    });
  });

  describe('DELETE /api/health-declarations/:id', () => {
    let createdDeclarationId;

    beforeEach(async () => {
      const response = await request(baseURL)
        .post('/api/health-declarations')
        .send({
          name: 'Test User for Delete',
          temperature: 36.5
        });
      
      createdDeclarationId = response.body.id;
    });

    it('should delete an existing declaration', async () => {
      await request(baseURL)
        .delete(`/api/health-declarations/${createdDeclarationId}`)
        .expect(204);

      await request(baseURL)
        .delete(`/api/health-declarations/${createdDeclarationId}`)
        .expect(404);
    });

    it('should return 404 when trying to delete non-existent declaration', async () => {
      const nonExistentId = 99999;

      const response = await request(baseURL)
        .delete(`/api/health-declarations/${nonExistentId}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Declaration not found');
    });
  });
});