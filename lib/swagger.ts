// lib/swagger.ts
import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = () => {
  const spec = createSwaggerSpec({
    apiFolder: 'app/api', // Path to API folder
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Employee Management API',
        version: '1.0.0',
        description: 'API for managing employee resources',
      },
      servers: [
        {
          url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
          description: 'Local development server',
        },
      ],
      components: {
        schemas: {
          Employee: {
            type: 'object',
            required: ['name', 'email', 'role'],
            properties: {
              id: { 
                type: 'integer',
                description: 'Unique identifier for the employee'
              },
              name: { 
                type: 'string',
                description: 'Full name of the employee'
              },
              email: { 
                type: 'string',
                format: 'email',
                description: 'Email address of the employee'
              },
              role: { 
                type: 'string',
                description: 'Job role of the employee'
              },
              company: { 
                type: 'string',
                description: 'Company name'
              },
              joinDate: { 
                type: 'string',
                format: 'date',
                description: 'Date when employee joined'
              },
              salary: { 
                type: 'number',
                description: 'Employee salary'
              },
              createdAt: { 
                type: 'string',
                format: 'date-time',
                description: 'Record creation timestamp'
              },
              updatedAt: { 
                type: 'string',
                format: 'date-time',
                description: 'Record last update timestamp'
              }
            }
          }
        }
      }
    }
  });
  return spec;
};