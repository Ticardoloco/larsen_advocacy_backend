import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type { Express, Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SWAGGER_CDN_CSS =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css";
const SWAGGER_CDN_JS = [
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.js",
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.js",
];

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Larsen Advocacy and Empowerment Foundation API",
      version: "1.0.0",
      description:
        "Centralized backend API documentation for managing Larsen Advocacy and Empowerment Foundation systems, including user authentication, roles, profiles, and administrative operations.",
    },
    servers: [
      {
        url: "/",
        description: "Current Host Environment",
      },
      {
        url: "http://localhost:4005",
        description: "Local Development Server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Input your JWT token to access protected endpoints. Example: 'Bearer eyJhbGciOi...'",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Internal Server Error" },
            error: { type: "object", nullable: true },
          },
        },
        Address: {
          type: "object",
          properties: {
            street: { type: "string", example: "12 Empowerment Way" },
            city: { type: "string", example: "Lagos" },
            state: { type: "string", example: "Lagos State" },
            zipCode: { type: "string", example: "100001" },
            country: { type: "string", example: "Nigeria" },
          },
        },
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64a2fbc8e4b0a1234567890a" },
            email: { type: "string", example: "beneficiary@larsen.org" },
            fullName: { type: "string", example: "Taiwo Egbeleke" },
            phoneNumber: { type: "string", example: "+2348012345678" },
            gender: { type: "string", enum: ["Male", "Female", "Other"], example: "Male" },
            address: { $ref: "#/components/schemas/Address" },
            role: { type: "string", enum: ["user", "admin", "super-admin"], example: "user" },
            isSuspended: { type: "boolean", example: false },
            suspensionReason: { type: "string", example: "" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  },
  // Captures route files (TypeScript & compiled JS)
  apis: [
    path.join(__dirname, "../routes/*.ts"),
    path.join(__dirname, "../routes/*.js"),
    path.join(__dirname, "./routes/*.ts"),
    path.join(__dirname, "./routes/*.js"),
    "./src/routes/*.ts",
    "./routes/*.js",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express): void {
  app.get("/docs.json", (_req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.json(swaggerSpec);
  });

  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCssUrl: SWAGGER_CDN_CSS,
      customJs: SWAGGER_CDN_JS,
    })
  );

  console.log("📄 Larsen Foundation API Docs active at /docs");
}