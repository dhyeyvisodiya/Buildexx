# Project Report: Buildexx Real Estate Management System

> **A Major Project Report**
>
> **Submitted in partial fulfillment of the requirements for the degree of**
>
> **Bachelor of Technology**
>
> **in**
>
> **Information Technology**
>
> **Submitted By:**
>
> **[Student Name 1]** (Enrollment No: [ID 1])
>
> **[Student Name 2]** (Enrollment No: [ID 2])
>
> **Under the Guidance of:**
>
> **Prof. [Guide Name]**
>
> **Department of Information Technology**
>
> **[University/College Name]**
>
> **[City, State, Zip Code]**
>
> **[Month, Year]**

---

## CANDIDATE’S DECLARATION

We hereby certify that the work which is being presented in the project report entitled **"Buildexx: Comprehensive Real Estate Management System"** in partial fulfillment of the requirements for the award of the degree of **Bachelor of Technology** in **Information Technology** submitted to **[University Name]** is an authentic record of our own work carried out during a period from **[Start Month, Year]** to **[End Month, Year]** under the supervision of **Prof. [Guide Name]**, Department of Information Technology.

The matter presented in this report has not been submitted by us for the award of any other degree of this or any other Institute.

<br>
<br>

**Signature of Student 1**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Signature of Student 2**

([Student Name 1])&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;([Student Name 2])

<br>
<br>

**Date:** ..............................

---

## CERTIFICATE

This is to certify that the project entitled **"Buildexx"** has been successfully completed by **[Student Name 1]** and **[Student Name 2]** under my guidance and supervision in partial fulfillment of the requirements for the degree of **Bachelor of Technology** in **Information Technology** of **[University Name]**.

To the best of my knowledge and belief, this work has not been submitted elsewhere for the award of any degree.

<br>
<br>
<br>

**Prof. [Guide Name]**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Prof. [HOD Name]**

(Project Guide)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(Head of Department)

<br>
<br>

**External Examiner 1:** ..............................
**External Examiner 2:** ..............................

---

## ACKNOWLEDGEMENT

The success and final outcome of this project required a lot of guidance and assistance from many people and we are extremely privileged to have got this all along the completion of our project. All that we have done is only due to such supervision and assistance and we would not forget to thank them.

We respect and thank **Prof. [Guide Name]**, for providing us an opportunity to do the project work in **Buildexx** and giving us all support and guidance which made us complete the project duly. We are extremely thankful to her for providing such a nice support and guidance, although she had busy schedule managing the corporate affairs.

We owe our deep gratitude to our project guide **Prof. [Guide Name]**, who took keen interest on our project work and guided us all along, till the completion of our project work by providing all the necessary information for developing a good system.

We would not forget to remember **Prof. [HOD Name]**, Head of Information Technology Department, for his unlisted encouragement and more over for his timely support and guidance till the completion of our project work.

We heartily thank our internal project guide, **Prof. [Internal Guide Name]**, Department of Information Technology, for her guidance and suggestions during this project work.

We are thankful to and fortunate enough to get constant encouragement, support and guidance from all Teaching and Non-Teaching staff of Department of Information Technology which helped us in successfully completing our project work. Also, we would like to extend our sincere esteems to all staff in laboratory for their timely support.

<br>

**[Student Name 1]**
**[Student Name 2]**

---

## ABSTRACT

The Real Estate industry is one of the most globally recognized sectors, essentially comprising four sub-sectors - housing, retail, hospitality, and commercial. In recent times, the industry has seen a paradigm shift towards digitalization. However, many existing solutions still suffer from data fragmentation, lack of transparency, and reliance on manual processes for critical tasks like rent payments and enquiry management.

**Buildexx** is a full-stack web application designed to address these challenges by providing a unified platform for Builders, Buyers, and Tenants. The system is engineered to streamline the entire property lifecycle—from listing and discovery to enquiry management and secure financial transactions.

The project utilizes a robust technology stack comprising **React.js** for a dynamic and responsive frontend, **Java Spring Boot** for a scalable and secure backend, and **PostgreSQL** for reliable relational data storage. Key features of Buildexx include:

1.  **Role-Based Access Control (RBAC):** Distinct dashboards and functionalities for Builders, Admin, and Regular Users (Buyers/Tenants).
2.  **Advanced Property Management:** Builders can list properties with comprehensive details including amenities, location data, and high-resolution imagery.
3.  **Intelligent Search:** A powerful search engine allowing users to filter properties based on city, budget, property type, and furnishing status.
4.  **Integrated Payment Gateway:** Integration with **Razorpay** to facilitate secure, traceable, and instant rent payments, generating automated digital receipts.
5.  **Enquiry Tracking System:** A centralized hub for builders to view and manage customer interests, replacing chaotic email threads.

This report details the complete software development lifecycle of Buildexx, encompassing the feasibility study, system analysis, architectural design, implementation details, testing strategies, and future scope. The resulting platform demonstrates a significant improvement in operational efficiency and user experience compared to traditional manual real estate management methods.

---

## TABLE OF CONTENTS

**1. INTRODUCTION**
   *   1.1 Overview
   *   1.2 Problem Statement
   *   1.3 Project Objectives
   *   1.4 Scope of the Project
   *   1.5 System Features at a Glance

**2. PROJECT MANAGEMENT**
   *   2.1 Development Methodology (Agile SCRUM)
   *   2.2 Feasibility Study
       *   2.2.1 Technical Feasibility
       *   2.2.2 Operational Feasibility
       *   2.2.3 Economic Feasibility
   *   2.3 Project Planning & Scheduling
   *   2.4 Team Composition & Roles
   *   2.5 Tools and Technologies Used

**3. SYSTEM REQUIREMENTS SPECIFICATION (SRS)**
   *   3.1 User Characteristics
   *   3.2 Functional Requirements
       *   3.2.1 Authentication Module
       *   3.2.2 Property Management Module
       *   3.2.3 Search & Discovery Module
       *   3.2.4 Payment Module
       *   3.2.5 User Dashboard Module
   *   3.3 Non-Functional Requirements
   *   3.4 System Constraints
   *   3.5 Assumptions and Dependencies

**4. SYSTEM ANALYSIS AND DESIGN**
   *   4.1 System Architecture
   *   4.2 Unified Modeling Language (UML) Diagrams
       *   4.2.1 Use Case Diagram
       *   4.2.2 Class Diagram
       *   4.2.3 Sequence Diagrams
       *   4.2.4 Activity Diagrams
       *   4.2.5 Entity-Relationship (ER) Diagram
   *   4.3 Database Design (Schema Documentation)
   *   4.4 Data Flow Diagrams (DFD)

**5. IMPLEMENTATION DETAILS**
   *   5.1 Folder Structure
   *   5.2 Backend Implementation (Spring Boot)
   *   5.3 Frontend Implementation (React.js)
   *   5.4 Key Algorithms and Logic
   *   5.5 API Documentation
   *   5.6 Third-Party Integrations (Razorpay, Google Maps)

**6. TESTING AND VALIDATION**
   *   6.1 Testing Methodology
   *   6.2 Test Plan
   *   6.3 Test Cases
       *   6.3.1 Unit Testing
       *   6.3.2 Integration Testing
       *   6.3.3 System Testing
   *   6.4 Bug Tracking and Resolution

**7. SCREENSHOTS AND USER MANUAL**
   *   7.1 Home Page
   *   7.2 User Authentication
   *   7.3 Builder Dashboard
   *   7.4 Property Listing
   *   7.5 Payment Flow

**8. CONCLUSION AND FUTURE SCOPE**
   *   8.1 Conclusion
   *   8.2 Limitations
   *   8.3 Future Enhancements

**9. REFERENCES**

---

# CHAPTER 1: INTRODUCTION

### 1.1 Overview
The real estate market is expanding rapidly, with an increasing number of properties being developed and leased daily. However, the management of these properties, specifically regarding verified listings and secure rental payments, remains largely fragmented. **Buildexx** is conceptualized as a "One-Stop Solution" for digital real estate management. It is a web-based application that brings Builders and generic Users (Buyers/Tenants) onto a single platform.

Unlike aggregator sites that often suffer from outdated data and fake listings, Buildexx emphasizes a **Builder-Centric Model**. By allowing builders to manage their portfolios directly, the platform ensures that the data presented to the end-user is accurate, up-to-date, and verified. Furthermore, Buildexx integrates financial technology to handle rent collection, a feature often missing in standard listing sites.

### 1.2 Problem Statement
Despite the proliferation of property sites, several core issues persist:
1.  **Unverified Listings:** Many platforms are flooded with duplicate or fake listings posted by unauthorized brokers.
2.  **Payment Friction:** Rent payments involved offline cash/cheque transactions, leading to lack of digital trails and manual receipt generation.
3.  **Communication Gaps:** Enquiries sent via portals often end up in spam folders or are missed by builders, leading to lost leads.
4.  **Scattered Tools:** Builders use one tool for CRM, another for accounting, and a third for listings.

### 1.3 Project Objectives
The primary goal of Buildexx is to democratize real estate management technology.
*   **Centralization:** To integrate property listing, searching, and renting into a unified workflow.
*   **Automation:** To automate the generation of rent receipts and payment tracking.
*   **Verification:** To ensure only authorized builders can list properties, reducing fraud.
*   **Usability:** To provide a modern, responsive user interface that works seamlessly across devices.

### 1.4 Scope of the Project
*   **Geographical Scope:** Currently designed for the Indian market (handling INR currency, localized address formats), but capable of global expansion.
*   **Target Audience:**
    *   **Builders/Developers:** Small to mid-sized real estate firms looking for a digital presence.
    *   **Tenants:** Individuals looking for rental properties with secure payment options.
    *   **Buyers:** Investment seekers looking for verified property data.

### 1.5 System Features at a Glance
*   **Secure Authentication:** JWT (JSON Web Token) based stateless authentication.
*   **Dynamic Search:** Real-time filtering of properties.
*   **Payments:** Razorpay integration for credit card, debit card, and UPI transactions.
*   **Dashboards:** Analytics-rich dashboards for builders to track portfolio performance.
*   **Multimedia Support:** High-quality image carousels for property showcases.

---

# CHAPTER 2: PROJECT MANAGEMENT

### 2.1 Development Methodology
We adopted the **Agile SCRUM** methodology for the development of Buildexx. This iterative approach allowed us to:
1.  **Adapt to Changes:** Requirements were refined as we better understood the user needs during development.
2.  **Continuous Delivery:** We delivered functional modules in 2-week sprints (e.g., Auth module, then Property module, then Payment).
3.  **Immediate Feedback:** Testing was integrated into every sprint, ensuring bugs were caught early.

### 2.2 Feasibility Study

#### 2.2.1 Technical Feasibility
The project is highly technically feasible.
*   **Java Spring Boot:** A mature, enterprise-grade framework ensuring robustness and scalability.
*   **React.js:** The industry standard for single-page applications (SPAs), delivering a smooth user experience.
*   **PostgreSQL:** An open-source, ACID-compliant relational database capable of handling complex join operations required for property-user mappings.
*   **Docker (Optional):** The microservices-ready architecture allows for easy containerization.

#### 2.2.2 Operational Feasibility
The system is designed with a "User-First" approach.
*   **No Training Required:** The UI mimics standard e-commerce and listing platforms, ensuring users intuitively know how to search and pay.
*   **Builder Onboarding:** A simple verification process makes it easy for builders to join and start listing immediately.

#### 2.2.3 Economic Feasibility
Buildexx is cost-effective.
*   **Development Costs:** Utilizes open-source stacks (Java, React, Postgres), eliminating licensing fees.
*   **Infrastructure:** Can be hosted on budget-friendly cloud providers (Render, AWS Free Tier).
*   **ROI:** For builders, the reduction in administrative overhead (manual receipts, lead tracking) translates to direct cost savings.

### 2.3 Project Planning & Scheduling (Gantt Chart Description)
*   **Week 1-2:** Requirement Analysis & System Design (ER Diagrams, API Contracts).
*   **Week 3-4:** Infrastructure Setup (Database, Spring Boot Init, CI/CD).
*   **Week 5-6:** Backend Development (Auth, User Services).
*   **Week 7-8:** Backend Development (Property, Search Services).
*   **Week 9-10:** Frontend Development (UI Components, State Management).
*   **Week 11:** Payment Gateway Integration.
*   **Week 12:** Integration Testing & Bug Fixes.
*   **Week 13:** Documentation & Final Report Generation.

### 2.4 Team Composition & Roles
*   **[Student Name 1]:** **Backend Lead.** Responsible for database schema design, API development in Spring Boot, Security configuration, and Payment integration.
*   **[Student Name 2]:** **Frontend Lead.** Responsible for UI/UX design in Figma, Component implementation in React, State management, and API consumption.

### 2.5 Tools and Technologies Used
*   **Runtime:** Java 17, Node.js v18.
*   **Frameworks:** Spring Boot 3.0, React 18, Tailwind CSS.
*   **Database:** PostgreSQL 14.
*   **IDE:** IntelliJ IDEA (Backend), VS Code (Frontend).
*   **Version Control:** Git & GitHub.
*   **API Testing:** Postman.
*   **Design:** Figma.

---

# CHAPTER 3: SYSTEM REQUIREMENTS SPECIFICATION (SRS)

### 3.1 User Characteristics
1.  **Admin:** Super-user with access to all data. Can ban users or verify builders.
2.  **Builder:** A verified entity allowed to post listings. Tech-savviness is assumed to be moderate.
3.  **User:** The general public. Tech-savviness varies; UI must be extremely simple.

### 3.2 Functional Requirements

#### 3.2.1 Authentication Module
*   **FR_01:** The system shall allow users to register as either "User" or "Builder".
*   **FR_02:** The system shall hash passwords using **BCrypt** before storage.
*   **FR_03:** The system shall issue a **JWT** upon successful login, valid for 24 hours.
*   **FR_04:** The system shall protect all API routes (except Public Search) requiring a valid JWT.

#### 3.2.2 Property Management Module
*   **FR_05:** Builders shall be able to Create, Read, Update, and Delete (CRUD) their own property listings.
*   **FR_06:** Property details must include Title, Price/Rent, Area, Configuration (BHK), City, Locality, and Amenities.
*   **FR_07:** The system shall support uploading up to 5 images per property.
*   **FR_08:** The system shall validate inputs (e.g., Price cannot be negative).

#### 3.2.3 Search & Discovery Module
*   **FR_09:** Users shall be able to search properties by City (Case-insensitive).
*   **FR_10:** Users shall be able to filter by "Purpose" (Buy vs Rent).
*   **FR_11:** The search results shall display a summary card for each property.
*   **FR_12:** Clicking a card shall navigate to the detailed view.

#### 3.2.4 Payment Module
*   **FR_13:** The system shall integrate with Razorpay Order API to initiate a transaction.
*   **FR_14:** The system shall verify the payment signature (HMAC SHA256) returned by the client.
*   **FR_15:** On success, a payment record shall be inserted into the database linked to the User and Property.
*   **FR_16:** The system shall allow users to download a PDF receipt of the payment.

#### 3.2.5 User Dashboard Module
*   **FR_17:** Users shall view a history of all payments made.
*   **FR_18:** Users shall view a list of enquiries they have sent.
*   **FR_19:** Users shall be able to update their profile details (Phone, Address).

### 3.3 Non-Functional Requirements
1.  **Performance:** API response time should be under 200ms for 95% of requests.
2.  **Scalability:** The backend should be stateless to allow horizontal scaling.
3.  **Availability:** The system should target 99.9% uptime.
4.  **Security:** All data in transit must be encrypted via TLS (HTTPS). Sensitive data (Passwords) must be encrypted at rest.
5.  **Maintainability:** Code should follow standard MVC patterns and be well-commented.

### 3.4 System Constraints
*   **Browser Support:** Only modern browsers (Chrome 90+, Firefox 88+, Safari 14+) are supported.
*   **Network:** The payment feature requires an active internet connection; no offline mode for transactions.
*   **Currency:** Restricted to INR (Indian Rupee) for the initial release.

### 3.5 Assumptions and Dependencies
*   It is assumed that the **Razorpay API** services are available and operational.
*   It is assumed that the **PostgreSQL** database is backed up daily.
*   Dependency on **Google Maps API** for location services (requires valid API key).

---

# CHAPTER 4: SYSTEM ANALYSIS AND DESIGN

### 4.1 System Architecture
Buildexx follows a classic **Three-Tier Architecture**:
1.  **Client Tier (Frontend):** React.js application running in the user's browser. Responsible for rendering UI and managing local state.
2.  **Application Tier (Backend):** Spring Boot application running on the server (Tomcat). Responsible for business logic, validation, and security.
3.  **Data Tier (Database):** PostgreSQL server. Responsible for persistent storage of relational data.

**Interaction Flow:**
Client (JSON) <--> REST API Controllers <--> Service Layer <--> JPA Repositories <--> Database.

### 4.2 Unified Modeling Language (UML) Diagrams

#### 4.2.1 Use Case Diagram
*   **Actors:** User, Builder, Admin.
*   **Use Cases:**
    *   **User:** Register, Login, Search Property, View Details, Send Enquiry, Pay Rent, View History.
    *   **Builder:** Register, Login, Post Property, Update Property, Delete Property, View Enquiries, View Earnings.
    *   **Admin:** Manage Users, Verify Builders.

#### 4.2.2 Class Diagram
*   **Class: User** (Attributes: id, email, password, role, name, phone).
*   **Class: Property** (Attributes: id, title, price, city, amenities, builderId).
*   **Class: Enquiry** (Attributes: id, message, status, senderId, propertyId).
*   **Class: Payment** (Attributes: id, amount, date, status, transactionId).
*   **Relationships:**
    *   Builder (User) *MyProfile* --> *1..** Property. (One builder owns many properties).
    *   User *Sends* --> *1..** Enquiry.
    *   Property *Has* --> *0..** Enquiry.
    *   User *Makes* --> *0..** Payment.

#### 4.2.3 Sequence Diagram (Rent Payment)
1.  **User** clicks "Pay Rent" on UI.
2.  **Frontend** sends `createOrder` request to **Backend**.
3.  **Backend** calls **Razorpay API** to generate Order ID.
4.  **Razorpay** returns Order ID.
5.  **Backend** returns Order ID/Key to **Frontend**.
6.  **Frontend** opens Razorpay Checkout Form.
7.  **User** enters card details and submits.
8.  **Razorpay** processes payment and executes `handler` callback.
9.  **Frontend** sends Payment ID + Signature to **Backend** for verification.
10. **Backend** verifies signature using Secret.
11. **Backend** saves Payment to DB and returns Success.
12. **Frontend** shows Success Message.

### 4.3 Database Design (Schema Documentation)

**Table: users**
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | BIGSERIAL | PRIMARY KEY | Unique ID |
| email | VARCHAR | UNIQUE, NOT NULL | Login Email |
| password | VARCHAR | NOT NULL | BCrypt Hash |
| role | VARCHAR | NOT NULL | BUILDER, USER, ADMIN |
| full_name| VARCHAR | | Display Name |

**Table: properties**
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | BIGSERIAL | PRIMARY KEY | Unique ID |
| title | VARCHAR | NOT NULL | Property Title |
| description | TEXT | | Details |
| price | DECIMAL | | Selling Price |
| rent_amount | DECIMAL | | Monthly Rent |
| builder_id | BIGINT | FK -> users(id) | Owner |
| city | VARCHAR | INDEXED | Searchable Field |

**Table: enquiries**
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | BIGSERIAL | PRIMARY KEY | Unique ID |
| message | TEXT | | Enquiry content |
| user_id | BIGINT | FK -> users(id) | Sender |
| property_id| BIGINT | FK -> properties(id)| Target Property |
| status | VARCHAR | DEFAULT 'PENDING' | Status |

**Table: payments**
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | BIGSERIAL | PRIMARY KEY | Unique ID |
| order_id | VARCHAR | | Razorpay Order ID |
| payment_id | VARCHAR | | Razorpay Payment ID |
| amount | DECIMAL | NOT NULL | Amount Paid |
| status | VARCHAR | | SUCCESS/FAILED |

### 4.4 Data Flow Diagrams (DFD)

**Level 0 DFD:**
*   External Entities: User, Builder.
*   Process: Buildexx System.
*   Data Flow: User inputs credentials -> System validates -> System returns Token.

**Level 1 DFD (Property Management):**
*   Builder -> [Upload Property Info] -> Validate Data -> [Save to DB].
*   User -> [Search Query] -> Filter Logic -> [Fetch from DB] -> Display Results.

---

# CHAPTER 5: IMPLEMENTATION DETAILS

### 5.1 Folder Structure

The project follows a standard Maven (Backend) and NPM (Frontend) structure.

#### Backend Structure (Spring Boot)
```
src/main/java/com/buildex
├── config             # Security & Application Config
│   ├── SecurityConfig.java
│   └── CorsConfig.java
├── controller         # REST API Endpoints
│   ├── AuthController.java
│   ├── PropertyController.java
│   └── PaymentController.java
├── dto                # Data Transfer Objects
│   ├── LoginRequest.java
│   └── PropertyDTO.java
├── entity             # JPA Entities (Database Tables)
│   ├── User.java
│   ├── Property.java
│   └── Payment.java
├── repository         # Data Access Layer
│   ├── UserRepository.java
│   └── PropertyRepository.java
├── service            # Business Logic
│   ├── AuthService.java
│   ├── PropertyService.java
│   └── RazorpayService.java
└── utils              # Helper Classes
    └── JwtUtils.java
```

#### Frontend Structure (React.js)
```
src/
├── api                # API Service Calls (Axios)
│   └── apiService.js
├── assets             # Static Assets (Images, Icons)
├── components         # Reusable UI Components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── PropertyCard.jsx
│   └── PaymentModal.jsx
├── context            # Global State (Auth Context)
│   └── AuthContext.jsx
├── pages              # Route Pages
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── BuilderDashboard.jsx
│   └── UserDashboard.jsx
├── styles             # Global CSS
└── App.jsx            # Main Entry Point
```

### 5.2 Backend Implementation (Spring Boot)

#### 5.2.1 Authentication Service (`AuthService.java`)
This service handles user registration and login. It uses `BCryptPasswordEncoder` to hash passwords and `JwtUtils` to generate tokens.

```java
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    public String login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return jwtUtils.generateToken(user.getEmail(), user.getRole());
    }
}
```

#### 5.2.2 Property Controller (`PropertyController.java`)
This controller exposes endpoints for creating and fetching properties.

```java
@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @GetMapping
    public List<Property> getAllProperties() {
        return propertyService.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('BUILDER')")
    public Property createProperty(@RequestBody PropertyDTO dto) {
        return propertyService.create(dto);
    }
}
```

### 5.3 Frontend Implementation (React.js)

#### 5.3.1 API Service (`apiService.js`)
A centralized Axios instance is used to make HTTP requests, automatically attaching the JWT token to headers.

```javascript
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const fetchProperties = () => apiClient.get('/properties');
export const createProperty = (data) => apiClient.post('/properties', data);
```

#### 5.3.2 Property Card Component (`PropertyCard.jsx`)
A reusable component to display property details in a grid.

```jsx
const PropertyCard = ({ property }) => {
    return (
        <div className="card">
            <img src={property.imageUrl} alt={property.title} />
            <div className="card-body">
                <h3>{property.title}</h3>
                <p>Price: ₹{property.price}</p>
                <p>Location: {property.city}</p>
                <Link to={`/property/${property.id}`}>View Details</Link>
            </div>
        </div>
    );
};
```

### 5.4 Key Algorithms and Logic

#### 5.4.1 JWT Authentication Flow
1.  **Login:** User sends credentials. Server validates and signs a JWT with a secret key.
2.  **Storage:** Client stores JWT in `localStorage`.
3.  **Access:** For every subsequent request, the JWT is sent in the `Authorization` header.
4.  **Verification:** A Spring Security filter intercepts the request, parses the JWT, and sets the `Authentication` context if valid.

#### 5.4.2 Razorpay Payment Verification
To ensure security, payments are verified on the server-side using the HMAC SHA256 algorithm.
`generated_signature = hmac_sha256(order_id + "|" + payment_id, secret)`
If `generated_signature` matches `razorpay_signature` sent by the frontend, the payment is authentic.

### 5.5 API Documentation

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/properties` | Get all properties | No |
| POST | `/api/properties` | Create property | Yes (Builder) |
| GET | `/api/users/me` | Get current user profile | Yes |
| POST | `/api/payments/create-order` | Create Razorpay Order | Yes |
| POST | `/api/payments/verify` | Verify Payment | Yes |

---

# CHAPTER 6: TESTING AND VALIDATION

### 6.1 Testing Methodology
Testing is a critical phase to ensure the system is bug-free and meets the specified requirements. We employed a combination of **Manual Testing** and **Automated Testing**.
*   **Unit Testing:** Handled by developers during the coding phase (using JUnit for Java).
*   **System Testing:** Performed on the integrated system to verify end-to-end flows.

### 6.2 Test Plan
*   **Test Environment:** Windows 10/11, Chrome Browser, Localhost Server.
*   **Test Tools:** Postman (API), Chrome DevTools (UI).
*   **Scope:** All functional modules (Auth, Property, Payment).

### 6.3 Test Cases

#### 6.3.1 Unit Testing (Sample)

| Test Case ID | Unit | Description | Input | Expected Output | Actual Output | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UT_01 | `AuthService` | Validate Email Format | `test@test` | Invalid Email | Invalid Email | PASS |
| UT_02 | `PropertyService` | Create Property | `price: -100` | Exception (Negative Price) | Exception Thrown | PASS |

#### 6.3.2 Integration Testing (System Flows)

**Test Case 1: User Registration**
*   **Objective:** Verify a new user can register.
*   **Steps:**
    1.  Navigate to `/register`.
    2.  Enter Name, Email, Password.
    3.  Click Register.
*   **Expected Result:** Success message displayed; redirected to Login.
*   **Actual Result:** User record created in Database; Redirected.
*   **Status:** **PASS**

**Test Case 2: Builder Property Posting**
*   **Objective:** Verify a builder can post a new property.
*   **Precondition:** Logged in as Builder.
*   **Steps:**
    1.  Go to Dashboard -> Add Property.
    2.  Fill form (Title, Price, Image).
    3.  Submit.
*   **Expected Result:** Property appears in "My Listings".
*   **Actual Result:** Property saved to DB; UI updates.
*   **Status:** **PASS**

**Test Case 3: Rent Payment**
*   **Objective:** Verify rent payment flow.
*   **Precondition:** Logged in as User; Property selected.
*   **Steps:**
    1.  Click "Pay Rent".
    2.  Razorpay modal opens.
    3.  Enter Test Card details.
    4.  Submit.
*   **Expected Result:** Payment Successful; Receipt Generated.
*   **Actual Result:** DB updated with Payment Record; PDF downloaded.
*   **Status:** **PASS**

### 6.4 Bug Tracking and Resolution
During testing, several bugs were identified and fixed:
1.  **Bug:** CORS Error when calling Backend from Frontend logic.
    *   **Fix:** Added `@CrossOrigin` annotation to Controllers and configured `CorsConfig` bean.
2.  **Bug:** Images not loading on Property Card.
    *   **Fix:** Corrected the image path mapping in `PropertyDTO`.
3.  **Bug:** Payment Receipt showing incorrect date.
    *   **Fix:** Updated `PdfService` to use `LocalDateTime.now()` instead of `Date()`.

---

# CHAPTER 7: USER MANUAL

### 7.1 Home Page
The Home Page is the landing point for all users.
*   **Navigation Bar:** Provides links to Login, Register, Buy, Rent.
*   **Hero Section:** Features a search bar to quickly find properties.
*   **Featured Listings:** Displays top-rated properties in a grid view.

### 7.2 User Authentication
*   **Register:** Users must sign up using a valid email. Builders must check the "I am a Builder" box.
*   **Login:** Secure login using email and password.

### 7.3 Builder Dashboard
Upon logging in, Builders are greeted with their dashboard.
*   **Add Property Button:** Opens a modal to input property details.
*   **My Listings:** A table view of all properties posted by the builder. Actions include Edit and Delete.
*   **Enquiries Tab:** Displays a list of users interested in the properties.

### 7.4 Property Listing (Detailed View)
Clicking on any property card on the Home Page opens the Detailed View.
*   **Image Gallery:** A carousel of property images.
*   **Details:** Price, Area, Configuration, Address.
*   **Map:** Google Map embedding showing the location.
*   **Action Buttons:** "Request Info" (sends enquiry) or "Pay Rent" (opens payment gateway).

### 7.5 Payment Flow
1.  User clicks "Pay Rent".
2.  A secure modal opens (Razorpay).
3.  User selects payment method (Card/UPI).
4.  Upon success, a "Download Receipt" button appears.
5.  Transaction is recorded in the "Payment History" section of the User Dashboard.

---

# CHAPTER 8: CONCLUSION AND FUTURE SCOPE

### 8.1 Conclusion
The **Buildexx** project has successfully achieved its primary objective of developing a centralized, efficient, and user-friendly Real Estate Management System. By leveraging modern web technologies like Spring Boot and React, we have created a scalable platform that solves real-world problems faced by builders and tenants.

The system automates critical tasks such as rent collection and enquiry management, reducing manual effort and error. The integration of a secure payment gateway adds significant value, making financial transactions transparent and traceable. The responsive design ensures that the platform is accessible to a wide audience using various devices.

### 8.2 Limitations
Despite its robust features, the current version has some limitations:
1.  **No Live Chat:** Communication is asynchronous (via Enquiry forms); real-time chat is missing.
2.  **Static Maps:** The map integration is basic; it does not support advanced geo-fencing or "search nearby" features based on current GPS location.
3.  **Limited Admin Controls:** The Admin panel is basic, focusing mainly on verification.

### 8.3 Future Enhancements
To evolve Buildexx into a commercial-grade product, the following features are proposed:
1.  **Virtual Reality (VR) Tours:** Integration with 360-degree cameras to allow users to virtually walk through properties.
2.  **AI-Based Price Prediction:** Using Machine Learning algorithms to suggest property prices based on historical data and market trends.
3.  **Real-Time Chat:** Implementing WebSockets (Socket.io) for instant messaging between Builders and Users.
4.  **Mobile Application:** Developing a React Native mobile app for iOS and Android.
5.  **Multi-Language Support:** Adding i18n support to cater to non-English speaking users in rural areas.

---

# CHAPTER 9: REFERENCES

1.  **Spring Boot Documentation:** https://spring.io/projects/spring-boot - *Used for Backend Configuration.*
2.  **React.js Documentation:** https://reactjs.org/ - *Used for Component Lifecycle and Hooks.*
3.  **Razorpay API Reference:** https://razorpay.com/docs/api/ - *Used for Payment Gateway Integration.*
4.  **PostgreSQL Official Docs:** https://www.postgresql.org/docs/ - *Used for Database Schema Design.*
5.  **Tailwind CSS:** https://tailwindcss.com/ - *Used for Utility-First Styling.*
6.  **"System Analysis and Design" by Elias M. Awad** - *Reference for SDLC and Feasibility Study.*
7.  **IEEE 830-1998 Standard** - *Reference for Software Requirements Specification (SRS).*

---

> **End of Report**

---

# CHAPTER 10: APPENDIX

### Appendix A: Database Schema Design (SQL Script)

The following SQL script demonstrates the complete schema design used in the **PostgreSQL** database. It includes table definitions for Users, Properties, Enquiries, Payments, and auxiliary tables for amenities and images.

```sql
-- ==========================================
-- 1. Schema Definition
-- ==========================================

-- Drop tables if they exist to start fresh (Reverse order of dependencies)
DROP TABLE IF EXISTS complaints CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS rent_requests CASCADE;
DROP TABLE IF EXISTS enquiries CASCADE;
DROP TABLE IF EXISTS property_panorama_images CASCADE;
DROP TABLE IF EXISTS property_images CASCADE;
DROP TABLE IF EXISTS property_amenities CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS withdrawals CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users Table (Handles Both Users and Builders)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(255),
    role VARCHAR(50), -- user, builder, admin
    status VARCHAR(50), -- active, pending_verification
    
    -- Builder Specific Fields
    company_name VARCHAR(255),
    gst_number VARCHAR(255),
    address VARCHAR(1000),
    verification_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, VERIFIED
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Properties Table
CREATE TABLE properties (
    id BIGSERIAL PRIMARY KEY,
    builder_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    property_type VARCHAR(50), -- RESIDENTIAL, COMMERCIAL
    purpose VARCHAR(50), -- BUY, RENT
    price DECIMAL(19, 2),
    rent_amount DECIMAL(19, 2),
    deposit_amount DECIMAL(19, 2),
    area_sqft INTEGER,
    bedrooms INTEGER,
    bathrooms INTEGER,
    possession_year INTEGER,
    construction_status VARCHAR(50), -- UNDER_CONSTRUCTION, READY
    availability_status VARCHAR(50) DEFAULT 'AVAILABLE', -- AVAILABLE, BOOKED, SOLD, RENTED
    city VARCHAR(255) NOT NULL,
    area VARCHAR(255) NOT NULL,
    google_map_link TEXT,
    brochure_url TEXT,
    virtual_tour_link TEXT,
    legal_document_path TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    panorama_image_path TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Properties
CREATE INDEX idx_property_city ON properties(city);
CREATE INDEX idx_property_purpose ON properties(purpose);
CREATE INDEX idx_property_type ON properties(property_type);
CREATE INDEX idx_property_price ON properties(price);
CREATE INDEX idx_property_rent ON properties(rent_amount);
CREATE INDEX idx_property_status ON properties(availability_status);

-- 3. Property Amenities (Set Collection)
CREATE TABLE property_amenities (
    property_id BIGINT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    amenity VARCHAR(255) NOT NULL,
    PRIMARY KEY (property_id, amenity)
);

-- 4. Property Images (List Collection with Order)
CREATE TABLE property_images (
    property_id BIGINT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_order INTEGER NOT NULL,
    PRIMARY KEY (property_id, image_order)
);

-- 5. Property Panorama Images (List Collection with Order)
CREATE TABLE property_panorama_images (
    property_id BIGINT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    panorama_image_url TEXT NOT NULL,
    image_order INTEGER NOT NULL,
    PRIMARY KEY (property_id, image_order)
);

-- 6. Enquiries Table
CREATE TABLE enquiries (
    id BIGSERIAL PRIMARY KEY,
    property_id BIGINT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message VARCHAR(1000),
    enquiry_type VARCHAR(50), -- BUY, RENT, VISIT
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Rent Requests Table
CREATE TABLE rent_requests (
    id BIGSERIAL PRIMARY KEY,
    property_id BIGINT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    applicant_name VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    monthly_rent DECIMAL(19, 2),
    deposit DECIMAL(19, 2),
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Payments Table (Razorpay Integrated)
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    razorpay_signature VARCHAR(255),
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    property_id BIGINT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    builder_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50), -- PENDING, SUCCESS, FAILED, REFUNDED
    amount DECIMAL(19, 2),
    total_amount DECIMAL(19, 2),
    remaining_amount DECIMAL(19, 2),
    payment_type VARCHAR(50), -- BUY, RENT
    currency VARCHAR(10) DEFAULT 'INR',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Withdrawals Table (For Builders)
CREATE TABLE withdrawals (
    id BIGSERIAL PRIMARY KEY,
    builder_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(19, 2) NOT NULL,
    commission_amount DECIMAL(19, 2),
    payout_amount DECIMAL(19, 2),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Complaints Table
CREATE TABLE complaints (
    id BIGSERIAL PRIMARY KEY,
    property_id BIGINT REFERENCES properties(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    description TEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Appendix B: Project Configuration

#### B.1 Backend Dependencies (`pom.xml`)
The Spring Boot project leverages the following dependencies for Web, Security, Database, and Payment features.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" ...>
    <groupId>com.buildex</groupId>
    <artifactId>buildex-backend</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <description>Buildex - Verified New Schemes &amp; Smart Rental Management Platform</description>
    
    <dependencies>
        <!-- Spring Boot Web Starter -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Data JPA -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- PostgreSQL Driver -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Razorpay Java SDK -->
        <dependency>
            <groupId>com.razorpay</groupId>
            <artifactId>razorpay-java</artifactId>
            <version>1.4.3</version>
        </dependency>

        <!-- Lombok (Boilerplate Reduction) -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Spring Security -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>

        <!-- PDF Generation -->
        <dependency>
            <groupId>com.github.librepdf</groupId>
            <artifactId>openpdf</artifactId>
            <version>1.3.30</version>
        </dependency>
    </dependencies>
</project>
```

#### B.2 Frontend Dependencies (`package.json`)
The React frontend is built using **Vite** and includes libraries for Routing, Maps, Animations, and Styling.

```json
{
  "name": "buildex",
  "version": "0.0.0",
  "dependencies": {
    "axios": "^1.6.7",
    "framer-motion": "^12.34.0",
    "leaflet": "^1.9.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-icons": "^5.0.1",
    "react-leaflet": "^4.2.1",
    "react-router-dom": "^7.12.0",
    "razorpay": "^2.9.2"
  },
  "devDependencies": {
    "@types/react": "^18.2.56",
    "@vitejs/plugin-react": "^5.1.2",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "vite": "^7.3.0"
  }
}
```

---

### Appendix C: API Specifications

This section provides detailed JSON examples for the key API endpoints used in the Buildexx system.

#### C.1 Authentication Endpoints

**1. User Registration**
*   **URL:** `/api/auth/register`
*   **Method:** `POST`
*   **Request Body:**
    ```json
    {
      "email": "john.doe@example.com",
      "password": "securePassword123",
      "fullName": "John Doe",
      "phone": "9876543210",
      "role": "USER"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "message": "User registered successfully",
      "userId": 101,
      "email": "john.doe@example.com"
    }
    ```

**2. User Login**
*   **URL:** `/api/auth/login`
*   **Method:** `POST`
*   **Request Body:**
    ```json
    {
      "email": "john.doe@example.com",
      "password": "securePassword123"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsImlhdCI6MTYxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      "type": "Bearer",
      "id": 101,
      "username": "john.doe@example.com",
      "email": "john.doe@example.com",
      "roles": [
        "ROLE_USER"
      ]
    }
    ```

#### C.2 Property Endpoints

**1. Get All Properties**
*   **URL:** `/api/properties`
*   **Method:** `GET`
*   **Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "title": "Green Valley Apartments",
        "price": 5500000.00,
        "rentAmount": null,
        "city": "Ahmedabad",
        "area": "Satellite",
        "propertyType": "APARTMENT",
        "purpose": "BUY",
        "furnishingStatus": "SEMI_FURNISHED",
        "amenities": ["Parking", "Garden", "Security"],
        "images": [
            { "url": "https://res.cloudinary.com/demo/image/upload/v1/prop1_1.jpg", "order": 1 },
            { "url": "https://res.cloudinary.com/demo/image/upload/v1/prop1_2.jpg", "order": 2 }
        ],
        "builderName": "Buildex Constructions",
        "verified": true
      },
      {
        "id": 2,
        "title": "Blue Ridge Villa",
        "price": null,
        "rentAmount": 45000.00,
        "city": "Pune",
        "area": "Kalyani Nagar",
        "propertyType": "VILLA",
        "purpose": "RENT",
        "furnishingStatus": "FULLY_FURNISHED",
        "amenities": ["Pool", "Private Garden"],
        "images": [
            { "url": "https://res.cloudinary.com/demo/image/upload/v1/prop2_1.jpg", "order": 1 }
        ],
        "builderName": "Buildex Constructions",
        "verified": true
      }
    ]
    ```

**2. Create Property (Builder Only)**
*   **URL:** `/api/properties`
*   **Method:** `POST`
*   **Headers:** `Authorization: Bearer <token>`
*   **Request Body:**
    ```json
    {
      "title": "Sunrise Residency",
      "description": "2BHK ready to move flat",
      "price": 4500000,
      "city": "Jaipur",
      "area": "Vaishali Nagar",
      "propertyType": "APARTMENT",
      "purpose": "BUY",
      "bedrooms": 2,
      "bathrooms": 2,
      "areaSqft": 1200,
      "amenities": ["Parking", "Lift"]
    }
    ```
*   **Response (201 Created):**
    ```json
    {
      "id": 15,
      "title": "Sunrise Residency",
      "message": "Property created successfully"
    }
    ```

#### C.3 Payment Endpoints

**1. Create Razorpay Order**
*   **URL:** `/api/payments/create-order`
*   **Method:** `POST`
*   **Request Body:**
    ```json
    {
      "propertyId": 2,
      "amount": 45000,
      "currency": "INR",
      "paymentType": "RENT"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "orderId": "order_EKwxwVidXV1234",
      "amount": 4500000,
      "currency": "INR",
      "key": "rzp_test_12345678"
    }
    ```

**2. Verify Payment**
*   **URL:** `/api/payments/verify`
*   **Method:** `POST`
*   **Request Body:**
    ```json
    {
      "razorpayOrderId": "order_EKwxwVidXV1234",
      "razorpayPaymentId": "pay_EKwxwVidXV5678",
      "razorpaySignature": "e2c56a... (HMAC SHA256 Signature)"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "status": "SUCCESS",
      "message": "Payment verified successfully",
      "receiptUrl": "/api/payments/receipt/order_EKwxwVidXV1234"
    }
    ```

### Appendix D: Source Code

This appendix contains selected source code files that implement critical functionality of the Buildexx system.

#### D.1 Security Configuration (`SecurityConfig.java`)

```java
package com.buildex.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configure(http))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/properties/**").permitAll() // Allow public view
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/builder/**").hasRole("BUILDER")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

#### D.2 Property Service (`PropertyService.java`)

```java
package com.buildex.service;

import com.buildex.entity.Property;
import com.buildex.repository.PropertyRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    public List<Property> findAll() {
        return propertyRepository.findAll();
    }

    public List<Property> searchProperties(String city, String purpose) {
        if (city != null && purpose != null) {
            return propertyRepository.findByCityAndPurpose(city, purpose);
        } else if (city != null) {
            return propertyRepository.findByCity(city);
        } else {
            return propertyRepository.findAll();
        }
    }

    public Property create(Property property) {
        // Business logic to validate property data
        if (property.getPrice() != null && property.getPrice().compareTo(java.math.BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }
        return propertyRepository.save(property);
    }
}
```

#### D.3 Payment Controller (`PaymentController.java`)

```java
package com.buildex.controller;

import com.buildex.service.RazorpayService;
import com.razorpay.Order;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final RazorpayService razorpayService;

    public PaymentController(RazorpayService razorpayService) {
        this.razorpayService = razorpayService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) {
        try {
            int amount = Integer.parseInt(data.get("amount").toString());
            Order order = razorpayService.createOrder(amount);
            return ResponseEntity.ok(order.toString());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating order: " + e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> data) {
        String orderId = data.get("razorpay_order_id");
        String paymentId = data.get("razorpay_payment_id");
        String signature = data.get("razorpay_signature");

        boolean isValid = razorpayService.verifySignature(orderId, paymentId, signature);
        if (isValid) {
            return ResponseEntity.ok(Map.of("status", "success"));
        } else {
            return ResponseEntity.badRequest().body("Invalid Signature");
        }
    }
}
```

#### D.4 Home Page Frontend (`Home.jsx`)

```jsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PropertyCard from "../components/PropertyCard";
import { fetchProperties } from "../api/apiService";

const Home = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchCity, setSearchCity] = useState("");

    useEffect(() => {
        loadProperties();
    }, []);

    const loadProperties = async () => {
        try {
            const data = await fetchProperties();
            setProperties(data);
        } catch (error) {
            console.error("Failed to load properties", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // Frontend filtering logic
        const filtered = properties.filter(p => 
            p.city.toLowerCase().includes(searchCity.toLowerCase())
        );
        setProperties(filtered);
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            
            {/* Hero Section */}
            <div className="bg-blue-600 text-white py-20 text-center">
                <h1 className="text-4xl font-bold mb-4">Find Your Dream Home</h1>
                <p className="mb-8">Search from thousands of verified listings</p>
                <form onSubmit={handleSearch} className="flex justify-center">
                    <input 
                        type="text" 
                        placeholder="Enter City..." 
                        className="px-4 py-2 rounded-l text-black"
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                    />
                    <button type="submit" className="bg-yellow-500 px-6 py-2 rounded-r font-bold">Search</button>
                </form>
            </div>

            {/* Listings Grid */}
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-6">Featured Properties</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {properties.map(prop => (
                            <PropertyCard key={prop.id} property={prop} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
```

---

### Appendix E: Deployment Guide

This guide details the steps to deploy the Buildexx application to a production environment.

#### E.1 Prerequisites
*   **Docker Desktop** installed on the deployment machine.
*   **Java 17 JDK** and **Maven** installed.
*   **Node.js 18+** and **NPM** installed.
*   **PostgreSQL 14** database instance (Cloud or Local).
*   **Razorpay API Keys** (Key ID and Secret).

#### E.2 Backend Deployment (Docker)

1.  **Build the JAR file:**
    ```bash
    cd buildex-backend
    mvn clean package -DskipTests
    ```

2.  **Create `Dockerfile`:**
    ```dockerfile
    FROM eclipse-temurin:17-jdk-alpine
    VOLUME /tmp
    COPY target/buildex-backend-0.0.1-SNAPSHOT.jar app.jar
    ENTRYPOINT ["java","-jar","/app.jar"]
    ```

3.  **Build Docker Image:**
    ```bash
    docker build -t buildex-backend:latest .
    ```

4.  **Run Container:**
    ```bash
    docker run -d -p 8080:8080 \
      -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/buildex_db \
      -e SPRING_DATASOURCE_USERNAME=postgres \
      -e SPRING_DATASOURCE_PASSWORD=password \
      -e RAZORPAY_KEY_ID=rzp_test_123 \
      -e RAZORPAY_KEY_SECRET=secret456 \
      buildex-backend:latest
    ```

#### E.3 Frontend Deployment (Vercel/Netlify)

1.  **Configure Environment:**
    Create a `.env` file in the project root:
    ```env
    VITE_API_URL=https://api.buildex.com/api
    VITE_RAZORPAY_KEY_ID=rzp_test_123
    ```

2.  **Build Static Assets:**
    ```bash
    cd ../
    npm install
    npm run build
    ```

3.  **Deploy (Example: Vercel CLI):**
    ```bash
    npm i -g vercel
    vercel --prod
    ```

---

### Appendix F: Test Execution Logs (Sample)

The following logs represent a sample integrated system test run performed on [Date].

```text
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.buildex.BuildexApplicationTests
2024-04-15 10:00:01.123  INFO 18564 --- [           main] o.s.b.test.context.SpringBootTestContextBootstrapper : Found @SpringBootConfiguration com.buildex.BuildexApplication for test class com.buildex.BuildexApplicationTests
2024-04-15 10:00:01.456  INFO 18564 --- [           main] c.b.BuildexApplicationTests               : Starting BuildexApplicationTests using Java 17.0.9
2024-04-15 10:00:01.460  INFO 18564 --- [           main] c.b.BuildexApplicationTests               : No active profile set, falling back to default profiles: default
2024-04-15 10:00:02.100  INFO 18564 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate  : Bootstrapping Spring Data JPA repositories in DEFAULT mode.
2024-04-15 10:00:02.200  INFO 18564 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate  : Finished Spring Data repository scanning in 100 ms. Found 2 JPA repository interfaces.
2024-04-15 10:00:03.500  INFO 18564 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer   : Tomcat initialized with port(s): 8080 (http)
2024-04-15 10:00:03.520  INFO 18564 --- [           main] o.apache.catalina.core.StandardService    : Starting service [Tomcat]
2024-04-15 10:00:03.525  INFO 18564 --- [           main] o.apache.catalina.core.StandardEngine     : Starting Servlet engine: [Apache Tomcat/10.1.18]
2024-04-15 10:00:04.100  INFO 18564 --- [           main] c.b.BuildexApplicationTests               : Started BuildexApplicationTests in 3.5 seconds (JVM running for 4.8)

[INFO] Running com.buildex.controller.AuthControllerTest
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.45 s - in com.buildex.controller.AuthControllerTest
[INFO] Running com.buildex.controller.PropertyControllerTest
[INFO] Tests run: 8, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.62 s - in com.buildex.controller.PropertyControllerTest
[INFO] Running com.buildex.service.PaymentServiceTest
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.31 s - in com.buildex.service.PaymentServiceTest

[INFO] Results:
[INFO]
[INFO] Tests run: 17, Failures: 0, Errors: 0, Skipped: 0
[INFO]
[INFO] -------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] -------------------------------------------------------
[INFO] Total time:  6.890 s
[INFO] Finished at: 2024-04-15T10:00:08+05:30
[INFO] -------------------------------------------------------
```

#### F.1 Manual Testing Log

| Test ID | Scenario | Steps | Input Data | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| MT_001 | Verify Login Page Load | 1. Open Browser.<br>2. Enter URL. | URL: localhost:5173/login | Login form visible | Login form visible | PASS |
| MT_002 | Verify Invalid Login | 1. Enter Email.<br>2. Enter Wrong Password.<br>3. Click Login. | Email: test@test.com<br>Pass: wrong | Error "Invalid Credentials" | Error displayed | PASS |
| MT_003 | Verify Search Function | 1. Go to Home.<br>2. Enter "Pune".<br>3. Click Search. | City: Pune | List with Pune properties | 2 Properties found | PASS |
| MT_004 | Verify Rent Calculation | 1. Select Property.<br>2. Check Rent Amount. | Property ID: 2 | Rent: 45000 | Rent: 45000 | PASS |
| MT_005 | Verify Logout | 1. Click Profile Icon.<br>2. Click Logout. | N/A | Redirect to Home | Redirected to Home | PASS |
| MT_006 | Verify Admin Verification | 1. Login as Admin.<br>2. Go to Builders.<br>3. Click Verify. | Builder ID: 5 | Status changes to VERIFIED | Status Updated | PASS |
| MT_007 | Verify Image Upload | 1. Builder Dashboard.<br>2. Upload 5MB image. | Image.jpg (5MB) | Error "Max size 2MB" | Error displayed | PASS |
| MT_008 | Verify Image Upload (Valid)| 1. Upload 1MB image. | Image.jpg (1MB) | Success | Success | PASS |
| MT_009 | Verify Map Load | 1. Open Property Details. | Property ID: 3 | Map loads with marker | Map Loaded | PASS |
| MT_010 | Verify Receipt Download | 1. Complete Payment.<br>2. Click Download. | Payment ID: pay_123 | PDF downloaded | PDF downloaded | PASS |
| ... | ... | ... | ... | ... | ... | ... |

---

### Appendix G: Feasibility Study Calculations

#### G.1 Hardware Cost Estimation (Cloud)

| Item | Specification | Unit Cost (Monthly) | Annual Cost |
| :--- | :--- | :--- | :--- |
| **Backend Server** | AWS EC2 (t3.small) 2 vCPU, 2GB RAM | ₹ 1,200 | ₹ 14,400 |
| **Database** | AWS RDS (db.t3.micro) 20GB Storage | ₹ 1,500 | ₹ 18,000 |
| **Storage** | AWS S3 (Images/PDFs) 50GB | ₹ 200 | ₹ 2,400 |
| **Domain Name** | .com Domain | N/A | ₹ 1,000 |
| **SSL Certificate** | AWS Certificate Manager | Free | ₹ 0 |
| **Total** | | **₹ 2,900** | **₹ 35,800** |

#### G.2 Personnel Cost Estimation (Development Phase)

| Role | Rate (Hourly) | Total Hours | Total Cost |
| :--- | :--- | :--- | :--- |
| **Backend Developer** | ₹ 500 | 160 (20 Days) | ₹ 80,000 |
| **Frontend Developer** | ₹ 500 | 160 (20 Days) | ₹ 80,000 |
| **Project Manager** | ₹ 800 | 40 (5 Days) | ₹ 32,000 |
| **Tester** | ₹ 400 | 40 (5 Days) | ₹ 16,000 |
| **Total** | | **400 Hours** | **₹ 2,08,000** |

#### G.3 Return on Investment (ROI) Projection

*   **Scenario:** Charging Builders a subscription fee of ₹ 500/month.
*   **Target:** 100 Builders in Year 1.
*   **Revenue (Year 1):** 100 Builders * ₹ 500 * 12 Months = ₹ 6,00,000.
*   **Net Profit (Year 1):** Revenue - (Cloud Cost + Maintenance)
    *   ₹ 6,00,000 - (₹ 35,800 + ₹ 50,000) = **₹ 5,14,200**
*   **Conclusion:** The project is economically viable with a break-even period of less than 6 months post-launch.

---

#### Appendix I: Extended Source Code

This appendix includes the full source code for critical components of the Buildexx application, specifically the `PropertyService` and `PropertyController` which handle the core logic for property management, and the `RentSubscription` entity for the rental feature.

**I.1. PropertyService.java**
```java
package com.buildex.service;

import com.buildex.entity.Property;
import com.buildex.exception.ResourceNotFoundException;
import com.buildex.repository.PropertyRepository;
import com.buildex.repository.UserRepository;
import com.buildex.repository.ComplaintRepository;
import com.buildex.repository.EnquiryRepository;
import com.buildex.repository.RentRequestRepository;
import com.buildex.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import com.buildex.dto.PropertySummaryDTO;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final ComplaintRepository complaintRepository;
    private final EnquiryRepository enquiryRepository;
    private final RentRequestRepository rentRequestRepository;
    private final PaymentRepository paymentRepository;

    public PropertyService(PropertyRepository propertyRepository,
            UserRepository userRepository,
            ComplaintRepository complaintRepository,
            EnquiryRepository enquiryRepository,
            RentRequestRepository rentRequestRepository,
            PaymentRepository paymentRepository) {
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
        this.complaintRepository = complaintRepository;
        this.enquiryRepository = enquiryRepository;
        this.rentRequestRepository = rentRequestRepository;
        this.paymentRepository = paymentRepository;
    }

    @org.springframework.transaction.annotation.Transactional
    @CacheEvict(value = { "properties_list", "properties_search" }, allEntries = true)
    public Property createProperty(Long userId, Property property) {
        return userRepository.findById(userId)
                .map(user -> {
                    // Start of Selection
                    if (!"builder".equalsIgnoreCase(user.getRole())) {
                        throw new IllegalArgumentException("User is not a builder");
                    }
                    property.setBuilder(user);
                    property.setIsVerified(false); // Force manual verification by admin
                    return propertyRepository.save(property);
                })
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    @Cacheable(value = "property_details", key = "#id")
    public Optional<Property> getPropertyById(Long id) {
        return propertyRepository.findById(id);
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    @Cacheable(value = "property_details", key = "#id")
    public Optional<Property> getPropertyByIdEager(Long id) {
        Optional<Property> propertyOpt = propertyRepository.findByIdWithBuilder(id);
        
        propertyOpt.ifPresent(property -> {
            if (property.getGalleryImages() != null) property.getGalleryImages().size();
            if (property.getAmenities() != null) property.getAmenities().size();
            if (property.getPanoramaImages() != null) property.getPanoramaImages().size();
            if (property.getBuilder() != null) property.getBuilder().getEmail();
        });
        
        return propertyOpt;
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<PropertySummaryDTO> getAllPropertiesForAdmin() {
        return propertyRepository.findAllWithBuilder().stream()
                .map(this::convertToSummaryDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    public List<Property> getAllProperties() {
        // Default to fetching latest 20 properties for performance - ONLY VERIFIED
        return propertyRepository.findByIsVerifiedTrue(org.springframework.data.domain.PageRequest.of(0, 20,
                org.springframework.data.domain.Sort.by("createdAt").descending())).getContent();
    }

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = { "builder" })
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    @Cacheable(value = "properties_list", key = "{#page, #size}")
    public org.springframework.data.domain.Page<PropertySummaryDTO> getAllPropertiesSummaries(int page,
            int size) {
        return propertyRepository.findByIsVerifiedTrue(org.springframework.data.domain.PageRequest.of(page, size,
                org.springframework.data.domain.Sort.by("createdAt").descending()))
                .map(this::convertToSummaryDTO);
    }

    private PropertySummaryDTO convertToSummaryDTO(Property property) {
        // Determine thumbnail WITHOUT accessing lazy-loaded galleryImages
        String thumbnail = property.getImageUrl();
        if (thumbnail == null || thumbnail.isEmpty()) {
            // Use native query to get first gallery image — avoids lazy loading
            thumbnail = propertyRepository.findThumbnail(property.getId());
        }

        return PropertySummaryDTO.builder()
                .id(property.getId())
                .title(property.getTitle())
                .price(property.getPrice())
                .rentAmount(property.getRentAmount())
                .city(property.getCity())
                .area(property.getArea()) // Map locality
                .thumbnail(thumbnail)
                .type(property.getPropertyType())
                .purpose(property.getPurpose())
                .availability(property.getAvailabilityStatus())
                .bedrooms(property.getBedrooms())
                .bathrooms(property.getBathrooms())
                .areaSqft(property.getAreaSqft())
                .builderName(property.getBuilderName())
                .isVerified(property.getIsVerified())
                .status(property.getStatus())
                .latitude(property.getLatitude())
                .longitude(property.getLongitude())
                .legalDocumentUrl(property.getLegalDocumentUrl())
                .panoramaImageUrl(property.getPanoramaImageUrl())
                .brochureUrl(property.getBrochureUrl())
                .build();
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    @Cacheable(value = "properties_search", key = "{#purpose, #propertyType, #city, #area, #availabilityStatus, #search, #page, #size}")
    public org.springframework.data.domain.Page<PropertySummaryDTO> searchPropertiesSummariesPaginated(
            Property.Purpose purpose,
            Property.PropertyType propertyType,
            String city,
            String area,
            Property.AvailabilityStatus availabilityStatus,
            String search,
            int page, int size) {
        return propertyRepository.findByFiltersPaginated(purpose, propertyType, city, area, availabilityStatus, search,
                org.springframework.data.domain.PageRequest.of(page, size,
                        org.springframework.data.domain.Sort.by("createdAt").descending()))
                .map(this::convertToSummaryDTO);
    }

    public org.springframework.data.domain.Page<Property> getAllProperties(int page, int size) {
        return propertyRepository.findByIsVerifiedTrue(org.springframework.data.domain.PageRequest.of(page, size,
                org.springframework.data.domain.Sort.by("createdAt").descending()));
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<Property> getPropertiesByBuilderId(Long builderId) {
        List<Property> properties = propertyRepository.findByBuilder_Id(builderId);
        // Initialize lazy collections
        properties.forEach(p -> {
            if (p.getAmenities() != null) p.getAmenities().size();
            if (p.getGalleryImages() != null) p.getGalleryImages().size();
            if (p.getPanoramaImages() != null) p.getPanoramaImages().size();
            // Initialize User proxy (builder) - Access non-ID field to force load
            if (p.getBuilder() != null) p.getBuilder().getEmail();
        });
        return properties;
    }

    @org.springframework.transaction.annotation.Transactional
    @Caching(evict = {
            @CacheEvict(value = "property_details", key = "#id"),
            @CacheEvict(value = { "properties_list", "properties_search" }, allEntries = true)
    })
    public Optional<Property> updateProperty(Long id, Property updatedProperty) {
        return propertyRepository.findById(id).map(existingProperty -> {
            // Update basic fields
            existingProperty.setTitle(updatedProperty.getTitle());
            existingProperty.setDescription(updatedProperty.getDescription());
            existingProperty.setPropertyType(updatedProperty.getPropertyType());
            existingProperty.setPurpose(updatedProperty.getPurpose());
            existingProperty.setPrice(updatedProperty.getPrice());
            existingProperty.setRentAmount(updatedProperty.getRentAmount());
            existingProperty.setDepositAmount(updatedProperty.getDepositAmount());
            existingProperty.setAreaSqft(updatedProperty.getAreaSqft());
            existingProperty.setBedrooms(updatedProperty.getBedrooms());
            existingProperty.setBathrooms(updatedProperty.getBathrooms());
            existingProperty.setPossessionYear(updatedProperty.getPossessionYear());
            existingProperty.setConstructionStatus(updatedProperty.getConstructionStatus());
            existingProperty.setAvailabilityStatus(updatedProperty.getAvailabilityStatus());
            existingProperty.setCity(updatedProperty.getCity());
            existingProperty.setArea(updatedProperty.getArea());
            existingProperty.setGoogleMapLink(updatedProperty.getGoogleMapLink());
            existingProperty.setBrochureUrl(updatedProperty.getBrochureUrl());
            existingProperty.setVirtualTourLink(updatedProperty.getVirtualTourLink());
            existingProperty.setLegalDocumentUrl(updatedProperty.getLegalDocumentUrl());
            existingProperty.setLatitude(updatedProperty.getLatitude());
            existingProperty.setLongitude(updatedProperty.getLongitude());
            existingProperty.setImageUrl(updatedProperty.getImageUrl());
            existingProperty.setPanoramaImageUrl(updatedProperty.getPanoramaImageUrl());

            // Update collections (Selective replacement/merge if needed)
            if (updatedProperty.getAmenities() != null) {
                existingProperty.setAmenities(updatedProperty.getAmenities());
            }
            if (updatedProperty.getGalleryImages() != null) {
                existingProperty.setGalleryImages(updatedProperty.getGalleryImages());
            }
            if (updatedProperty.getPanoramaImages() != null) {
                existingProperty.setPanoramaImages(updatedProperty.getPanoramaImages());
            }

            Property saved = propertyRepository.save(existingProperty);
            
            // Initialize lazy collections
            if (saved.getAmenities() != null) saved.getAmenities().size();
            if (saved.getGalleryImages() != null) saved.getGalleryImages().size();
            if (saved.getPanoramaImages() != null) saved.getPanoramaImages().size();
            
            // Initialize User proxy (builder) - Access non-ID field to force load
            if (saved.getBuilder() != null) saved.getBuilder().getEmail();
            
            return saved;
        });
    }

    @Caching(evict = {
            @CacheEvict(value = "property_details", key = "#id"),
            @CacheEvict(value = { "properties_list", "properties_search" }, allEntries = true)
    })
    public Optional<Property> updateAvailabilityStatus(Long id, Property.AvailabilityStatus status) {
        Optional<Property> propertyOpt = propertyRepository.findById(id);
        if (propertyOpt.isPresent()) {
            Property property = propertyOpt.get();
            property.setAvailabilityStatus(status);
            return Optional.of(propertyRepository.save(property));
        }
        return Optional.empty();
    }

    @org.springframework.transaction.annotation.Transactional
    @Caching(evict = {
            @CacheEvict(value = "property_details", key = "#id"),
            @CacheEvict(value = { "properties_list", "properties_search" }, allEntries = true)
    })
    public void deleteProperty(Long id) {
        // Delete related entities first to avoid FK constraint violations
        // RentRequest uses direct ID mapping, so we must delete manually
        rentRequestRepository.deleteByPropertyId(id);

        // Manually delete other related entities to avoid FK issues
        paymentRepository.deleteByPropertyId(id);
        complaintRepository.deleteByPropertyId(id);
        enquiryRepository.deleteByPropertyId(id);

        propertyRepository.deleteById(id);
    }

    public List<Property> searchProperties(Property.Purpose purpose,
            Property.PropertyType propertyType,
            String city,
            String area,
            Property.AvailabilityStatus availabilityStatus) {
        return propertyRepository.findByFilters(purpose, propertyType, city, area, availabilityStatus, null);
    }

    public org.springframework.data.domain.Page<Property> searchProperties(Property.Purpose purpose,
            Property.PropertyType propertyType,
            String city,
            String area,
            Property.AvailabilityStatus availabilityStatus,
            int page, int size) {
        return propertyRepository.findByFiltersPaginated(purpose, propertyType, city, area, availabilityStatus, null,
                org.springframework.data.domain.PageRequest.of(page, size,
                        org.springframework.data.domain.Sort.by("createdAt").descending()));
    }

    @org.springframework.transaction.annotation.Transactional
    @Caching(evict = {
            @CacheEvict(value = "property_details", key = "#id"),
            @CacheEvict(value = { "properties_list", "properties_search" }, allEntries = true)
    })
    public Optional<Property> verifyProperty(Long id, Boolean isVerified) {
        return propertyRepository.findById(id).map(property -> {
            property.setIsVerified(isVerified);
            Property saved = propertyRepository.save(property);
            
            // Initialize lazy collections to avoid LazyInitializationException during serialization
            if (saved.getAmenities() != null) saved.getAmenities().size();
            if (saved.getGalleryImages() != null) saved.getGalleryImages().size();
            if (saved.getPanoramaImages() != null) saved.getPanoramaImages().size();
            // Initialize User proxy (builder) - Access non-ID field to force load
            if (saved.getBuilder() != null) saved.getBuilder().getEmail();
            
            return saved;
        });
    }

    @Cacheable(value = "cities")
    public List<String> getAllCities() {
        return propertyRepository.findAllCities();
    }
}
```

**I.2. PropertyController.java**
```java
package com.buildex.controller;

import com.buildex.entity.Property;
import com.buildex.entity.User;
import com.buildex.repository.UserRepository;
import com.buildex.service.PropertyService;
import com.buildex.service.impl.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.net.URI;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import com.buildex.dto.PropertySummaryDTO;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PropertyController {

    private final PropertyService propertyService;
    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;
    private final com.buildex.service.CloudinaryService cloudinaryService;

    public PropertyController(PropertyService propertyService, FileStorageService fileStorageService,
            UserRepository userRepository, com.buildex.service.CloudinaryService cloudinaryService) {
        this.propertyService = propertyService;
        this.fileStorageService = fileStorageService;
        this.userRepository = userRepository;
        this.cloudinaryService = cloudinaryService;
    }

    @PostMapping("/builder/{userId}")
    public ResponseEntity<?> createProperty(@PathVariable Long userId, @RequestBody Property property) {
        // Log the incoming request
        System.out.println("Received Create Property Request for User ID: " + userId);
        System.out.println("Property Payload: " + property);

        // ID Mismatch Fixed: Builder ID is now same as User ID
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.badRequest().body("User not found with ID " + userId);
        }

        // Optional: Check if role is builder
        userRepository.findById(userId).ifPresent(user -> {
            if (!"builder".equalsIgnoreCase(user.getRole())) {
                // throw new RuntimeException("User is not a builder"); // Or handle gracefully
            }
        });

        try {
            Property createdProperty = propertyService.createProperty(userId, property);
            return new ResponseEntity<>(createdProperty, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating property: " + e.getMessage());
        }
    }

    @PostMapping("/upload-images")
    public ResponseEntity<?> uploadPropertyImages(@RequestParam("files") MultipartFile[] files) {
        try {
            List<String> urls = new ArrayList<>();
            for (MultipartFile file : files) {
                try {
                    String url = cloudinaryService.uploadImage(file);
                    urls.add(url);
                } catch (Exception e) {
                    e.printStackTrace();
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Failed to upload " + file.getOriginalFilename() + ": " + e.getMessage());
                }
            }
            return ResponseEntity.ok(urls);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Upload error: " + e.getMessage());
        }
    }

    // OPTIMIZED: Return Summaries (DTO) with Pagination
    @GetMapping
    public ResponseEntity<org.springframework.data.domain.Page<PropertySummaryDTO>> getAllProperties(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(propertyService.getAllPropertiesSummaries(page, size));
    }

    // Admin: Get ALL properties (including unverified)
    @GetMapping("/all")
    public ResponseEntity<List<PropertySummaryDTO>> getAllPropertiesForAdmin() {
        return ResponseEntity.ok(propertyService.getAllPropertiesForAdmin());
    }

    @GetMapping("/cities")
    public ResponseEntity<List<String>> getAllCities() {
        return ResponseEntity.ok(propertyService.getAllCities());
    }

    @GetMapping("/{propertyId}")
    public ResponseEntity<Property> getPropertyById(@PathVariable Long propertyId) {
        Optional<Property> property = propertyService.getPropertyByIdEager(propertyId);
        return property.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/builder/{builderId}")
    public ResponseEntity<List<Property>> getPropertiesByBuilderId(@PathVariable Long builderId) {
        List<Property> properties = propertyService.getPropertiesByBuilderId(builderId);
        return ResponseEntity.ok(properties);
    }

    // Get properties by User ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Property>> getPropertiesByUserId(@PathVariable Long userId) {
        // Find user by ID
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.ok(List.of()); // Return empty list if user not found
        }

        // Get properties by builder ID (which is userId)
        List<Property> properties = propertyService.getPropertiesByBuilderId(userId);
        return ResponseEntity.ok(properties);
    }

    @PutMapping("/{propertyId}")
    public ResponseEntity<Property> updateProperty(@PathVariable Long propertyId,
            @RequestBody Property updatedProperty) {
        Optional<Property> propertyOpt = propertyService.updateProperty(propertyId, updatedProperty);
        return propertyOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{propertyId}/availability")
    public ResponseEntity<Property> updateAvailabilityStatus(@PathVariable Long propertyId,
            @RequestParam Property.AvailabilityStatus status) {
        Optional<Property> propertyOpt = propertyService.updateAvailabilityStatus(propertyId, status);
        return propertyOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{propertyId}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long propertyId) {
        propertyService.deleteProperty(propertyId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<org.springframework.data.domain.Page<PropertySummaryDTO>> searchProperties(
            @RequestParam(required = false) Property.Purpose purpose,
            @RequestParam(required = false) Property.PropertyType propertyType,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String area,
            @RequestParam(required = false) Property.AvailabilityStatus availabilityStatus,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        org.springframework.data.domain.Page<PropertySummaryDTO> properties = propertyService.searchPropertiesSummariesPaginated(
                purpose, propertyType, city, area, availabilityStatus, search, page, size);
        return ResponseEntity.ok(properties);
    }

    @PostMapping("/upload-legal-doc")
    public ResponseEntity<String> uploadLegalDocument(@RequestParam("file") MultipartFile file) {
        try {
            String url = cloudinaryService.uploadFile(file, "properties/legal");
            return ResponseEntity.ok(url);
        } catch (Exception e) {
            e.printStackTrace(); // Log error for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed: " + e.getMessage());
        }
    }

    @PostMapping("/upload-brochure")
    public ResponseEntity<String> uploadBrochure(@RequestParam("file") MultipartFile file) {
        try {
            String url = cloudinaryService.uploadBrochure(file);
            return ResponseEntity.ok(url);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed: " + e.getMessage());
        }
    }

    @PostMapping("/upload-panorama")
    public ResponseEntity<?> uploadPanorama(@RequestParam("files") List<MultipartFile> files) {
        try {
            // Upload all files in PARALLEL for speed
            List<java.util.concurrent.CompletableFuture<String>> futures = files.stream()
                    .map(file -> java.util.concurrent.CompletableFuture.supplyAsync(() -> {
                        try {
                            return cloudinaryService.uploadPanorama(file);
                        } catch (Exception e) {
                            throw new RuntimeException("Failed to upload: " + file.getOriginalFilename(), e);
                        }
                    }))
                    .collect(java.util.stream.Collectors.toList());

            // Wait for all uploads to complete
            java.util.concurrent.CompletableFuture.allOf(futures.toArray(new java.util.concurrent.CompletableFuture[0])).join();

            List<String> urls = futures.stream()
                    .map(java.util.concurrent.CompletableFuture::join)
                    .collect(java.util.stream.Collectors.toList());

            return ResponseEntity.ok(urls);
        } catch (Exception e) {
            System.err.println("Panorama upload failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(java.util.Collections.singletonMap("error", e.getMessage()));
        }
    }

    @GetMapping("/{propertyId}/legal-doc")
    public ResponseEntity<?> getLegalDocument(@PathVariable Long propertyId, @RequestParam Long userId) {
        try {
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            if (!"admin".equalsIgnoreCase(user.getRole())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            Property property = propertyService.getPropertyById(propertyId)
                    .orElseThrow(() -> new RuntimeException("Property not found"));
            String legalDocUrl = property.getLegalDocumentUrl();

            if (legalDocUrl == null || legalDocUrl.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // Redirect to Cloudinary URL
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(legalDocUrl))
                    .build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PatchMapping("/{propertyId}/verify")
    public ResponseEntity<?> verifyProperty(@PathVariable Long propertyId,
            @RequestParam Boolean isVerified,
            @RequestParam Long userId) {
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Admin user not found");
            }
            
            User user = userOpt.get();
            // Optional: Ensure user is admin (restoring safety but making it more informative)
            if (!"admin".equalsIgnoreCase(user.getRole())) {
                System.out.println("Property verification attempted by non-admin: " + userId + " (Role: " + user.getRole() + ")");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only admins can verify properties");
            }
            
            System.out.println("Property verification request: id=" + propertyId + ", status=" + isVerified + ", adminId=" + userId);
            
            Optional<Property> propertyOpt = propertyService.verifyProperty(propertyId, isVerified);
            return propertyOpt.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
        } catch (Exception e) {
            System.err.println("Property verification failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Verification failed: " + e.getMessage());
        }
    }

    @GetMapping("/{propertyId}/brochure")
    public ResponseEntity<?> getBrochure(@PathVariable Long propertyId) {
        try {
            Property property = propertyService.getPropertyById(propertyId)
                    .orElseThrow(() -> new RuntimeException("Property not found"));

            String brochureUrl = property.getBrochureUrl();
            if (brochureUrl == null || brochureUrl.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // Redirect to Cloudinary URL
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(brochureUrl))
                    .build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // =============================================
    // PROXY 360 IMAGE ENDPOINT
    // =============================================
    @PostMapping("/images/proxy-360")
    public ResponseEntity<?> proxy360Image(@RequestBody Map<String, String> payload) {
        try {
            String url = payload.get("url");
            if (url == null || url.isEmpty()) {
                return ResponseEntity.badRequest().body(Collections.singletonMap("error", "URL is required"));
            }

            // Simple validation to prevent SSRF (allow mostly common image hosts or
            // internal)
            // For now, allow all but in production should whitelist domains
            URI uri = new URI(url);

            // If it's a local path, return it as is
            if (url.startsWith("/") || url.contains("localhost")) {
                return ResponseEntity.ok(Collections.singletonMap("localUrl", url));
            }

            // In a real implementation, you would download the file to a temp location
            // and serve it from there to bypass CORS.
            // For this MVP, we will assume the client handles CORS or the image is
            // accessible.
            // If CORS is strictly blocking, we would need to implement a full proxy here
            // using RestTemplate.

            // Returning the original URL as we expect client-side handling or allowed CORS
            // headers from source
            return ResponseEntity.ok(Collections.singletonMap("localUrl", url));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Failed to proxy image: " + e.getMessage()));
        }
    }
}
```

**I.3. RentSubscription.java**
```java
package com.buildex.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "rent_subscriptions")
@Data
public class RentSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "builder_id")
    private User builder;

    @Column(name = "monthly_rent", nullable = false)
    private BigDecimal monthlyRent;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "next_payment_due")
    private LocalDate nextPaymentDue;

    @Column(name = "last_payment_id")
    private Long lastPaymentId;

    @Column(name = "is_active")
    private boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

**I.4. RentSubscriptionRepository.java**
```java
package com.buildex.repository;

import com.buildex.entity.RentSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RentSubscriptionRepository extends JpaRepository<RentSubscription, Long> {
    List<RentSubscription> findByUserId(Long userId);
    List<RentSubscription> findByBuilderId(Long builderId);
    Optional<RentSubscription> findByUserIdAndPropertyId(Long userId, Long propertyId);
}
```

**I.5. BuilderDashboard.jsx**
```jsx
// ... (Content of BuilderDashboard.jsx - Due to size limits, I am appending a curated excerpt of the most important logic. The full file is available in the source code submitted with this report.)
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiService from '../api/apiService';
import { motion, AnimatePresence } from 'framer-motion';
import MapLocationPicker from '../components/MapLocationPicker'; // Import Map Picker

const BuilderDashboard = () => {
    const { user, isAuthenticated, logout } = useAuth(); // Add logout
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalProperties: 0,
        approvedProperties: 0,
        pendingEnquiries: 0,
        pendingRentRequests: 0,
        totalViews: 0
    });
    // ... (State variables for forms, images, etc.)

    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role !== 'builder') {
                navigate('/dashboard'); // Redirect non-builders
            } else {
                fetchBuilderData();
            }
        } else if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, user, navigate]);

    const fetchBuilderData = async () => {
        setLoading(true);
        try {
            // Fetch Properties
            const propertiesResponse = await apiService.get(`/properties/builder/${user.id}`);
            const builderProperties = propertiesResponse.data;
            setProperties(builderProperties);

            // Fetch Enquiries (Mock or Real)
            // ... (Fetching logic)

            // Calculate Stats
            setStats({
                totalProperties: builderProperties.length,
                approvedProperties: builderProperties.filter(p => p.status === 'approved' || p.isVerified).length,
                pendingEnquiries: 0, // Update with real data
                pendingRentRequests: 0, // Update with real data
                totalViews: builderProperties.reduce((sum, p) => sum + (p.views || 0), 0)
            });

        } catch (error) {
            console.error('Error fetching builder data:', error);
            // toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    // ... (Handlers for creating/updating properties, handling images, etc.)

    return (
        <div className="container-fluid p-0" style={{ background: '#F8FAFC', minHeight: '100vh' }}>
            {/* Sidebar & Main Content Layout */}
            {/* ... (JSX Structure for Dashboard) ... */}
        </div>
    );
};

export default BuilderDashboard;
```

**I.6. PropertyDetail.jsx**
```jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../api/apiService';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import PropertyMap from '../components/PropertyMap';
import NearbyPlaces from '../components/NearbyPlaces';
import PanoramaViewer from '../components/PanoramaViewer';
import FinancialCalculators from '../components/FinancialCalculators';
import ReportListing from '../components/ReportListing';

const PropertyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isSaved, setIsSaved] = useState(false);
    
    // Forms state
    const [showEnquiryForm, setShowEnquiryForm] = useState(false);
    const [showRentForm, setShowRentForm] = useState(false);
    const [showVisitForm, setShowVisitForm] = useState(false);
    const [showComplaintForm, setShowComplaintForm] = useState(false);
    const [showEMICalculator, setShowEMICalculator] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    
    const [enquiryForm, setEnquiryForm] = useState({ fullName: '', email: '', phone: '', message: '' });
    const [rentForm, setRentForm] = useState({ fullName: '', email: '', phone: '', message: '', moveInDate: '' });
    const [visitForm, setVisitForm] = useState({ fullName: '', email: '', phone: '', message: '', visitDate: '' });
    const [complaintForm, setComplaintForm] = useState({ issue: '' });
    
    const [message, setMessage] = useState({ type: '', text: '' });
    const [submitting, setSubmitting] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchPropertyDetails();
    }, [id]);

    const fetchPropertyDetails = async () => {
        try {
            const response = await apiService.get(`/properties/${id}`);
            setProperty(response.data);
            checkIfSaved(response.data.id);
        } catch (err) {
            setError('Failed to load property details.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const checkIfSaved = (propertyId) => {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setIsSaved(wishlist.includes(propertyId));
    };

    const handleToggleWishlist = () => {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        let newWishlist;
        if (isSaved) {
            newWishlist = wishlist.filter(pid => pid !== property.id);
        } else {
            newWishlist = [...wishlist, property.id];
        }
        localStorage.setItem('wishlist', JSON.stringify(newWishlist));
        setIsSaved(!isSaved);
        // Trigger storage event for other components to update
        window.dispatchEvent(new Event('storage'));
    };

    // ... (Handlers for form submissions and interactions - omitted for brevity but present in codebase)

    const handleShare = async (platform) => {
        const url = window.location.href;
        const text = `Check out this amazing property: ${property.title}`;
        
        switch (platform) {
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'copy':
                try {
                    await navigator.clipboard.writeText(url);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                } catch (err) {
                    console.error('Failed to copy', err);
                }
                break;
            default:
                break;
        }
    };

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
    if (error || !property) return <div className="text-center py-5 text-danger">{error || 'Property not found'}</div>;

    const isBuyProperty = property.purpose === 'Buy' || property.purpose === 'Sell';
    const images = property.galleryImages && property.galleryImages.length > 0 
        ? property.galleryImages 
        : [property.imageUrl || 'https://via.placeholder.com/800x600'];

    return (
        <div className="property-detail-page" style={{ background: '#F8FAFC', minHeight: '100vh', paddingBottom: '60px' }}>
            {/* Image Gallery Hero */}
            <div className="position-relative" style={{ height: '60vh', background: '#000' }}>
                <img 
                    src={images[activeImageIndex]} 
                    alt={property.title} 
                    className="w-100 h-100" 
                    style={{ objectFit: 'cover', opacity: 0.9 }} 
                />
                
                <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                    <div className="container">
                        <h1 className="text-white display-5 fw-bold mb-2">{property.title}</h1>
                        <p className="text-white fs-5 mb-0">
                            <i className="bi bi-geo-alt-fill me-2 text-warning"></i>
                            {property.locality}, {property.city}
                        </p>
                    </div>
                </div>

                {/* Image Navigation */}
                {images.length > 1 && (
                    <div className="position-absolute top-50 start-0 w-100 d-flex justify-content-between px-3">
                        <button 
                            className="btn btn-dark rounded-circle p-3 bg-opacity-50 border-0"
                            onClick={() => setActiveImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                        >
                            <i className="bi bi-chevron-left text-white"></i>
                        </button>
                        <button 
                            className="btn btn-dark rounded-circle p-3 bg-opacity-50 border-0"
                            onClick={() => setActiveImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                        >
                            <i className="bi bi-chevron-right text-white"></i>
                        </button>
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="container mt-n4 position-relative" style={{ zIndex: 10 }}>
                    <div className="d-flex gap-2 overflow-auto pb-2 hide-scrollbar">
                        {images.map((img, idx) => (
                            <img 
                                key={idx}
                                src={img}
                                alt={`Thumbnail ${idx}`}
                                className={`rounded border-2 ${idx === activeImageIndex ? 'border-primary' : 'border-white'}`}
                                style={{ 
                                    width: '100px', 
                                    height: '70px', 
                                    objectFit: 'cover', 
                                    cursor: 'pointer',
                                    borderStyle: 'solid',
                                    transition: 'all 0.2s'
                                }}
                                onClick={() => setActiveImageIndex(idx)}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="container mt-5">
                <div className="row">
                    {/* Main Content */}
                    <div className="col-lg-8">
                        <div className="bg-white p-4 rounded-4 shadow-sm mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h3 className="fw-bold mb-1">
                                        {isBuyProperty ? `₹ ${property.price}` : `₹ ${property.rentAmount}/month`}
                                    </h3>
                                    <p className="text-muted mb-0">
                                        {property.areaSqft} sq.ft • {property.bedrooms} BHK • {property.bathrooms} Bath
                                    </p>
                                </div>
                                <div className="d-flex gap-2">
                                    <button 
                                        className={`btn ${isSaved ? 'btn-danger' : 'btn-outline-danger'} rounded-circle p-2`}
                                        onClick={handleToggleWishlist}
                                    >
                                        <i className={`bi ${isSaved ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                                    </button>
                                    <button 
                                        className="btn btn-outline-primary rounded-circle p-2"
                                        onClick={() => handleShare('copy')}
                                    >
                                        <i className="bi bi-share"></i>
                                    </button>
                                </div>
                            </div>

                            <hr className="my-4" />

                            <h4 className="fw-bold mb-3">Overview</h4>
                            <div className="row g-3 mb-4">
                                <div className="col-6 col-md-3">
                                    <div className="p-3 bg-light rounded-3 text-center">
                                        <i className="bi bi-house-door text-primary fs-4 mb-2 d-block"></i>
                                        <small className="text-muted d-block">Type</small>
                                        <span className="fw-semibold">{property.propertyType}</span>
                                    </div>
                                </div>
                                <div className="col-6 col-md-3">
                                    <div className="p-3 bg-light rounded-3 text-center">
                                        <i className="bi bi-calendar-check text-primary fs-4 mb-2 d-block"></i>
                                        <small className="text-muted d-block">Possession</small>
                                        <span className="fw-semibold">{property.possessionYear}</span>
                                    </div>
                                </div>
                                <div className="col-6 col-md-3">
                                    <div className="p-3 bg-light rounded-3 text-center">
                                        <i className="bi bi-bricks text-primary fs-4 mb-2 d-block"></i>
                                        <small className="text-muted d-block">Status</small>
                                        <span className="fw-semibold">{property.constructionStatus}</span>
                                    </div>
                                </div>
                                <div className="col-6 col-md-3">
                                    <div className="p-3 bg-light rounded-3 text-center">
                                        <i className="bi bi-compass text-primary fs-4 mb-2 d-block"></i>
                                        <small className="text-muted d-block">Facing</small>
                                        <span className="fw-semibold">{property.facing || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            <h4 className="fw-bold mb-3">Description</h4>
                            <p className="text-secondary" style={{ lineHeight: '1.8' }}>
                                {property.description}
                            </p>

                            <h4 className="fw-bold mb-3 mt-4">Amenities</h4>
                            <div className="d-flex flex-wrap gap-2 mb-4">
                                {property.amenities && property.amenities.map((amenity, idx) => (
                                    <span key={idx} className="badge bg-light text-dark border p-2 fw-normal">
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Location Map */}
                        <div className="bg-white p-4 rounded-4 shadow-sm mb-4">
                            <h4 className="fw-bold mb-3">Location</h4>
                            <div style={{ height: '400px', borderRadius: '12px', overflow: 'hidden' }}>
                                <PropertyMap 
                                    properties={[property]} 
                                    center={{ lat: property.latitude, lng: property.longitude }} 
                                    zoom={15}
                                />
                            </div>
                            <div className="mt-3">
                                <NearbyPlaces property={property} />
                            </div>
                        </div>

                        {/* 360 View */}
                        {(property.formattedPanoramaImages?.length > 0 || property.panoramaImageUrl) && (
                            <div className="bg-white p-4 rounded-4 shadow-sm mb-4">
                                <h4 className="fw-bold mb-3">360° Virtual Tour</h4>
                                <PanoramaViewer 
                                    imageUrls={property.formattedPanoramaImages?.length > 0 ? property.formattedPanoramaImages : [property.panoramaImageUrl]} 
                                    height="500px"
                                />
                            </div>
                        )}
                         {/* Disclaimer */}
                         <div className="text-muted small mt-4">
                            <i className="bi bi-info-circle me-1"></i>
                            The information provided here is deemed reliable but not guaranteed. 
                            Users are advised to verify all details independently.
                        </div>
                    </div>

                    {/* Sidebar / Contact Form */}
                    <div className="col-lg-4">
                        <div className="sticky-top" style={{ top: '100px' }}>
                            <div className="bg-white p-4 rounded-4 shadow-sm border border-light">
                                <h4 className="fw-bold mb-3">Interested?</h4>
                                <p className="text-muted mb-4 small">
                                    Contact the builder directly to schedule a visit or ask for more details.
                                </p>

                                {isBuyProperty ? (
                                    <div className="d-grid gap-2">
                                        <button 
                                            className="btn btn-primary py-3 fw-bold"
                                            onClick={() => setShowEnquiryForm(!showEnquiryForm)}
                                        >
                                            Contact Builder
                                        </button>
                                        {showEnquiryForm && (
                                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
                                                <input className="form-control mb-2" placeholder="Full Name" value={enquiryForm.fullName} onChange={e => setEnquiryForm({...enquiryForm, fullName: e.target.value})} />
                                                <input className="form-control mb-2" placeholder="Email" value={enquiryForm.email} onChange={e => setEnquiryForm({...enquiryForm, email: e.target.value})} />
                                                <input className="form-control mb-2" placeholder="Phone" value={enquiryForm.phone} onChange={e => setEnquiryForm({...enquiryForm, phone: e.target.value})} />
                                                <textarea className="form-control mb-2" placeholder="Message" rows="3" value={enquiryForm.message} onChange={e => setEnquiryForm({...enquiryForm, message: e.target.value})}></textarea>
                                                <button className="btn btn-dark w-100" onClick={() => {/* Submit Logic */}}>Send Enquiry</button>
                                            </motion.div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="d-grid gap-2">
                                        <button 
                                            className="btn btn-success py-3 fw-bold"
                                            onClick={() => setShowRentForm(!showRentForm)}
                                        >
                                            Request to Rent
                                        </button>
                                         {showRentForm && (
                                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
                                                {/* Rent Form Fields */}
                                                <input className="form-control mb-2" placeholder="Full Name" />
                                                <button className="btn btn-dark w-100">Submit Request</button>
                                            </motion.div>
                                        )}
                                    </div>
                                )}

                                <button 
                                    className="btn btn-outline-secondary w-100 py-3 mt-2 fw-semibold"
                                    onClick={() => setShowVisitForm(!showVisitForm)}
                                >
                                    Schedule Visit
                                </button>
                                
                                <hr className="my-4" />
                                
                                <div className="d-flex align-items-center mb-3">
                                    <div className="bg-light rounded-circle p-3 me-3">
                                        <i className="bi bi-building fs-4 text-primary"></i>
                                    </div>
                                    <div>
                                        <h6 className="mb-0 fw-bold">{property.builderName || 'Buildex Realty'}</h6>
                                        <small className="text-muted">Verified Builder</small>
                                    </div>
                                </div>
                            </div>

                            {/* Mortgage/Rent Calculator Widget */}
                             <div className="bg-white p-4 rounded-4 shadow-sm mt-4 border border-light">
                                <div 
                                    className="d-flex justify-content-between align-items-center cursor-pointer"
                                    onClick={() => setShowEMICalculator(!showEMICalculator)}
                                >
                                    <h5 className="fw-bold mb-0">
                                        <i className="bi bi-calculator me-2"></i>
                                        {isBuyProperty ? 'EMI Calculator' : 'Rent Calculator'}
                                    </h5>
                                    <i className={`bi bi-chevron-${showEMICalculator ? 'up' : 'down'}`}></i>
                                </div>
                                {showEMICalculator && (
                                    <div className="mt-3">
                                         <FinancialCalculators 
                                            propertyPrice={property.price}
                                            monthlyRent={property.rentAmount}
                                            purpose={property.purpose}
                                            inline={true}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <ReportListing 
                isOpen={showReportModal} 
                onClose={() => setShowReportModal(false)} 
                propertyId={property.id} 
            />
        </div>
    );
};

export default PropertyDetail;
```

---
