--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: workflow_applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workflow_applications (
    application_id integer NOT NULL,
    workflow_id integer NOT NULL,
    application_no character varying(100) NOT NULL,
    created_by integer NOT NULL,
    office_id integer NOT NULL,
    current_state_id integer NOT NULL,
    application_status character varying(30) DEFAULT 'Pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.workflow_applications OWNER TO postgres;

--
-- Name: applications_application_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.applications_application_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.applications_application_id_seq OWNER TO postgres;

--
-- Name: applications_application_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.applications_application_id_seq OWNED BY public.workflow_applications.application_id;


--
-- Name: applications_housing; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.applications_housing (
    id integer NOT NULL,
    applicant_name character varying(100),
    mobile_number character varying(20),
    address text,
    house_type character varying(50),
    annual_income numeric,
    income_certificate character varying(255),
    address_proof character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.applications_housing OWNER TO postgres;

--
-- Name: applications_housing_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.applications_housing_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.applications_housing_id_seq OWNER TO postgres;

--
-- Name: applications_housing_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.applications_housing_id_seq OWNED BY public.applications_housing.id;


--
-- Name: attachments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attachments (
    attachment_id integer NOT NULL,
    application_id integer NOT NULL,
    file_name character varying(255) NOT NULL,
    file_path character varying(500) NOT NULL,
    uploaded_by integer NOT NULL,
    uploaded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.attachments OWNER TO postgres;

--
-- Name: attachments_attachment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attachments_attachment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attachments_attachment_id_seq OWNER TO postgres;

--
-- Name: attachments_attachment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attachments_attachment_id_seq OWNED BY public.attachments.attachment_id;


--
-- Name: boiler_applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.boiler_applications (
    id integer NOT NULL,
    applicant_name character varying(255),
    mobile_number character varying(15),
    address text,
    boiler_type character varying(255),
    boiler_capacity numeric,
    year_of_installation integer,
    purpose text,
    boiler_certificate character varying(500)
);


ALTER TABLE public.boiler_applications OWNER TO postgres;

--
-- Name: menu_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menu_master (
    id integer NOT NULL,
    menu_name character varying(100),
    menu_path character varying(200),
    icon character varying(50),
    parent_id integer,
    is_active boolean DEFAULT true
);


ALTER TABLE public.menu_master OWNER TO postgres;

--
-- Name: menus_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.menus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.menus_id_seq OWNER TO postgres;

--
-- Name: menus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.menus_id_seq OWNED BY public.menu_master.id;


--
-- Name: offices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.offices (
    office_id integer NOT NULL,
    office_name character varying(255) NOT NULL,
    office_type character varying(100) NOT NULL,
    parent_office integer,
    district character varying(100),
    state character varying(100),
    is_active boolean DEFAULT true NOT NULL,
    block_id integer
);


ALTER TABLE public.offices OWNER TO postgres;

--
-- Name: offices_office_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.offices_office_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.offices_office_id_seq OWNER TO postgres;

--
-- Name: offices_office_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.offices_office_id_seq OWNED BY public.offices.office_id;


--
-- Name: role_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_master (
    id bigint NOT NULL,
    role_name character varying(50) NOT NULL
);


ALTER TABLE public.role_master OWNER TO postgres;

--
-- Name: role_menus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_menus (
    id integer NOT NULL,
    role_id integer,
    menu_id integer
);


ALTER TABLE public.role_menus OWNER TO postgres;

--
-- Name: role_menus_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.role_menus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.role_menus_id_seq OWNER TO postgres;

--
-- Name: role_menus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.role_menus_id_seq OWNED BY public.role_menus.id;


--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.role_master.id;


--
-- Name: services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.services (
    service_id integer NOT NULL,
    service_name character varying(200) NOT NULL,
    service_code character varying(50) NOT NULL,
    workflow_id integer NOT NULL,
    route character varying(200) NOT NULL,
    icon character varying(200),
    description text,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.services OWNER TO postgres;

--
-- Name: services_service_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.services_service_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.services_service_id_seq OWNER TO postgres;

--
-- Name: services_service_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.services_service_id_seq OWNED BY public.services.service_id;


--
-- Name: student; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student (
    id integer NOT NULL,
    name character varying(100),
    email character varying(100)
);


ALTER TABLE public.student OWNER TO postgres;

--
-- Name: student_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.student_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.student_id_seq OWNER TO postgres;

--
-- Name: student_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.student_id_seq OWNED BY public.student.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    full_name character varying(255) NOT NULL,
    phone_number character varying(20),
    role_id bigint NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    is_verified boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    office_id integer,
    district character varying(100),
    block_id integer
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: workflow_actions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workflow_actions (
    action_id integer NOT NULL,
    action_name character varying(100) NOT NULL
);


ALTER TABLE public.workflow_actions OWNER TO postgres;

--
-- Name: workflow_actions_action_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.workflow_actions_action_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.workflow_actions_action_id_seq OWNER TO postgres;

--
-- Name: workflow_actions_action_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.workflow_actions_action_id_seq OWNED BY public.workflow_actions.action_id;


--
-- Name: workflow_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workflow_history (
    history_id integer NOT NULL,
    application_id integer NOT NULL,
    task_id integer,
    from_state_id integer,
    to_state_id integer,
    action_id integer,
    performed_by integer NOT NULL,
    performed_office integer,
    remarks text,
    performed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    ip_address character varying(50)
);


ALTER TABLE public.workflow_history OWNER TO postgres;

--
-- Name: workflow_history_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.workflow_history_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.workflow_history_history_id_seq OWNER TO postgres;

--
-- Name: workflow_history_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.workflow_history_history_id_seq OWNED BY public.workflow_history.history_id;


--
-- Name: workflow_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workflow_master (
    workflow_id integer NOT NULL,
    workflow_name character varying(255) NOT NULL,
    module_name character varying(255) NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.workflow_master OWNER TO postgres;

--
-- Name: workflow_master_workflow_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.workflow_master_workflow_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.workflow_master_workflow_id_seq OWNER TO postgres;

--
-- Name: workflow_master_workflow_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.workflow_master_workflow_id_seq OWNED BY public.workflow_master.workflow_id;


--
-- Name: workflow_states; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workflow_states (
    state_id integer NOT NULL,
    workflow_id integer NOT NULL,
    state_name character varying(100) NOT NULL,
    display_order integer NOT NULL,
    is_start boolean DEFAULT false NOT NULL,
    is_end boolean DEFAULT false NOT NULL
);


ALTER TABLE public.workflow_states OWNER TO postgres;

--
-- Name: workflow_states_state_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.workflow_states_state_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.workflow_states_state_id_seq OWNER TO postgres;

--
-- Name: workflow_states_state_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.workflow_states_state_id_seq OWNED BY public.workflow_states.state_id;


--
-- Name: workflow_tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workflow_tasks (
    task_id integer NOT NULL,
    application_id integer NOT NULL,
    state_id integer NOT NULL,
    assigned_to integer,
    assigned_office integer,
    task_status character varying(30) DEFAULT 'Pending'::character varying,
    priority character varying(20) DEFAULT 'Normal'::character varying,
    assigned_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    completed_at timestamp without time zone,
    due_date timestamp without time zone,
    remarks text,
    assigned_role_id integer
);


ALTER TABLE public.workflow_tasks OWNER TO postgres;

--
-- Name: workflow_tasks_task_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.workflow_tasks_task_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.workflow_tasks_task_id_seq OWNER TO postgres;

--
-- Name: workflow_tasks_task_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.workflow_tasks_task_id_seq OWNED BY public.workflow_tasks.task_id;


--
-- Name: workflow_transitions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workflow_transitions (
    transition_id integer NOT NULL,
    workflow_id integer NOT NULL,
    from_state_id integer NOT NULL,
    to_state_id integer NOT NULL,
    action_id integer NOT NULL,
    role_id integer NOT NULL,
    is_active boolean DEFAULT true,
    remarks_required boolean DEFAULT false,
    attachment_required boolean DEFAULT false,
    sla_days integer DEFAULT 0,
    next_role_id integer
);


ALTER TABLE public.workflow_transitions OWNER TO postgres;

--
-- Name: workflow_transitions_transition_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.workflow_transitions_transition_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.workflow_transitions_transition_id_seq OWNER TO postgres;

--
-- Name: workflow_transitions_transition_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.workflow_transitions_transition_id_seq OWNED BY public.workflow_transitions.transition_id;


--
-- Name: applications_housing id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications_housing ALTER COLUMN id SET DEFAULT nextval('public.applications_housing_id_seq'::regclass);


--
-- Name: attachments attachment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments ALTER COLUMN attachment_id SET DEFAULT nextval('public.attachments_attachment_id_seq'::regclass);


--
-- Name: menu_master id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_master ALTER COLUMN id SET DEFAULT nextval('public.menus_id_seq'::regclass);


--
-- Name: offices office_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offices ALTER COLUMN office_id SET DEFAULT nextval('public.offices_office_id_seq'::regclass);


--
-- Name: role_master id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_master ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: role_menus id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_menus ALTER COLUMN id SET DEFAULT nextval('public.role_menus_id_seq'::regclass);


--
-- Name: services service_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services ALTER COLUMN service_id SET DEFAULT nextval('public.services_service_id_seq'::regclass);


--
-- Name: student id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student ALTER COLUMN id SET DEFAULT nextval('public.student_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: workflow_actions action_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_actions ALTER COLUMN action_id SET DEFAULT nextval('public.workflow_actions_action_id_seq'::regclass);


--
-- Name: workflow_applications application_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_applications ALTER COLUMN application_id SET DEFAULT nextval('public.applications_application_id_seq'::regclass);


--
-- Name: workflow_history history_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_history ALTER COLUMN history_id SET DEFAULT nextval('public.workflow_history_history_id_seq'::regclass);


--
-- Name: workflow_master workflow_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_master ALTER COLUMN workflow_id SET DEFAULT nextval('public.workflow_master_workflow_id_seq'::regclass);


--
-- Name: workflow_states state_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_states ALTER COLUMN state_id SET DEFAULT nextval('public.workflow_states_state_id_seq'::regclass);


--
-- Name: workflow_tasks task_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_tasks ALTER COLUMN task_id SET DEFAULT nextval('public.workflow_tasks_task_id_seq'::regclass);


--
-- Name: workflow_transitions transition_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_transitions ALTER COLUMN transition_id SET DEFAULT nextval('public.workflow_transitions_transition_id_seq'::regclass);


--
-- Data for Name: applications_housing; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.applications_housing (id, applicant_name, mobile_number, address, house_type, annual_income, income_certificate, address_proof, created_at) FROM stdin;
54	asdfasdf	1234564562	asdfadf	Commercial	21215	\N	\N	2026-08-14 16:18:24.774637
\.


--
-- Data for Name: attachments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attachments (attachment_id, application_id, file_name, file_path, uploaded_by, uploaded_at) FROM stdin;
\.


--
-- Data for Name: boiler_applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.boiler_applications (id, applicant_name, mobile_number, address, boiler_type, boiler_capacity, year_of_installation, purpose, boiler_certificate) FROM stdin;
53	boiler	1234567899	asdfdas	Hot Water Boiler	22	2025	asdfa	1786692597170-LowFareAcknowledgement (1) (1).pdf
55	dfhf	7234567899	sdfg	Steam Boiler	21	2022	sdfg	1787138115646-LowFareAcknowledgement.pdf
56	tyuyu	9465462154	sdfgsdfg	Hot Water Boiler	22	2022	uhjkghj	1787140164356-LowFareAcknowledgement.pdf
57	asdf	3213256	asdf	Steam Boiler	23	2022	asdfsssdfffsdfsdfsdfsdf	\N
\.


--
-- Data for Name: menu_master; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.menu_master (id, menu_name, menu_path, icon, parent_id, is_active) FROM stdin;
1	1 Dashboard	/dashboard	\N	\N	t
2	2 Task	/task	\N	\N	t
3	3 Create Staff	/staff/create	\N	\N	t
4	4 Reports	/reports	\N	\N	t
5	5 e-Services	/services	\N	\N	t
6	6 Admin	/admin	\N	\N	t
7	7 Track Status	/application-status	\N	\N	t
8	8 Workflow History	/workflow-application-history	\N	\N	t
\.


--
-- Data for Name: offices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.offices (office_id, office_name, office_type, parent_office, district, state, is_active, block_id) FROM stdin;
1	malda office	bdooffice	35	malda	west bengal	t	1
\.


--
-- Data for Name: role_master; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_master (id, role_name) FROM stdin;
1	ADMIN
2	USER
3	STAFF
4	Applicant
5	Verifier
6	District Officer
7	State Officer
8	Inspector
9	Institute
10	Treasury
\.


--
-- Data for Name: role_menus; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_menus (id, role_id, menu_id) FROM stdin;
1	1	1
2	1	2
3	1	3
4	1	4
5	2	1
6	2	4
7	3	1
8	3	5
11	2	3
10	2	2
9	2	5
12	3	6
13	4	5
16	5	3
15	5	2
14	5	1
18	6	3
17	6	1
19	6	2
21	4	1
24	6	7
23	5	7
22	4	7
25	6	8
20	7	3
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.services (service_id, service_name, service_code, workflow_id, route, icon, description, display_order, is_active, created_at) FROM stdin;
1	Housing Assistance	HOUSING	1	/services/housing	house	Apply for Housing Assistance	1	t	2026-08-06 15:58:59.231365
2	Boiler Inspection	BOILER	2	/services/boiler	factory	Boiler Inspection Services	2	t	2026-08-06 15:58:59.231365
3	Scholarship	SCHOLARSHIP	3	/services/scholarship	school	Scholarship Application	3	t	2026-08-06 15:58:59.231365
\.


--
-- Data for Name: student; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student (id, name, email) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password_hash, full_name, phone_number, role_id, is_active, is_verified, created_at, updated_at, office_id, district, block_id) FROM stdin;
1	verifier	verifier@gmail.com	$2b$10$OBV1aokQRnNdSBFazQwi4.jRRSi.1JKjJDKoe4VJAwbbmEv5DTo0G	verifier	9876543212	5	t	f	2026-07-24 13:59:06.355463	2026-07-24 13:59:06.355463	1	malda	1
4	applicant	applicant@gmail.com	$2b$10$OBV1aokQRnNdSBFazQwi4.jRRSi.1JKjJDKoe4VJAwbbmEv5DTo0G	applicant	9876543212	4	t	f	2026-07-24 13:59:06.355463	2026-07-24 13:59:06.355463	1	malda	1
2	approver	approver@gmail.com	$2b$10$OBV1aokQRnNdSBFazQwi4.jRRSi.1JKjJDKoe4VJAwbbmEv5DTo0G	District Officer	9876543212	6	t	f	2026-07-24 13:59:06.355463	2026-07-24 13:59:06.355463	1	malda	1
\.


--
-- Data for Name: workflow_actions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workflow_actions (action_id, action_name) FROM stdin;
1	Submit
2	Approve
3	Reject
4	Return
5	Forward
6	Resubmit
7	Withdraw
8	Cancel
\.


--
-- Data for Name: workflow_applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workflow_applications (application_id, workflow_id, application_no, created_by, office_id, current_state_id, application_status, created_at, updated_at) FROM stdin;
53	2	AppBoiler-1786692593628	4	1	14	Approved	2026-08-14 12:59:53.576703	2026-08-14 17:00:47.394133
54	1	AppHousing-1786704504840	4	1	5	Approved	2026-08-14 16:18:24.774637	2026-08-14 17:55:06.293086
56	2	APPBoiler-1787140164671	4	1	11	Submitted	2026-08-19 17:19:24.652863	2026-08-19 17:19:24.652863
57	2	AppBoiler-1787140287364	4	1	10	Draft	2026-08-19 17:21:27.370252	2026-08-19 17:21:27.370252
55	2	AppBoiler-1787138116190	4	1	13	In Progress	2026-08-19 16:45:15.764252	2026-08-20 17:04:24.562207
\.


--
-- Data for Name: workflow_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workflow_history (history_id, application_id, task_id, from_state_id, to_state_id, action_id, performed_by, performed_office, remarks, performed_at, ip_address) FROM stdin;
89	53	77	10	11	1	4	1	Application Submitted	2026-08-14 12:59:57.569212	::1
90	53	77	11	13	5	1	1	asdfsad	2026-08-14 13:13:57.92833	::1
91	54	79	1	2	1	4	1	Application Submitted	2026-08-14 16:23:59.166806	::1
92	54	79	2	4	5	1	1	\N	2026-08-14 17:00:25.979487	::1
93	53	78	13	14	2	2	1	\N	2026-08-14 17:00:47.394133	::1
94	54	80	4	5	2	2	1	\N	2026-08-14 17:55:06.293086	::1
95	55	81	10	11	1	4	1	Application Submitted	2026-08-19 17:15:47.927112	::1
96	56	82	10	11	1	4	1	Application Submitted	2026-08-19 17:19:24.652863	::1
97	55	81	11	13	5	1	1	\N	2026-08-20 17:04:24.562207	::1
\.


--
-- Data for Name: workflow_master; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workflow_master (workflow_id, workflow_name, module_name, is_active) FROM stdin;
1	Housing	Housing	t
2	Boiler Inspection	Boiler Inspection	t
3	Scholarship	Scholarship	t
4	Pension	Pension	t
\.


--
-- Data for Name: workflow_states; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workflow_states (state_id, workflow_id, state_name, display_order, is_start, is_end) FROM stdin;
1	1	Draft	1	t	f
2	1	Submitted	2	f	f
13	2	Inspection Report	5	f	f
14	2	Certificate Issued	6	f	t
15	2	Rejected	7	f	t
16	3	Application Draft	1	t	f
17	3	Application Submitted	2	f	f
18	3	Institute Verification	3	f	f
19	3	District Verification	4	f	f
20	3	State Verification	5	f	f
21	3	Sanctioned	6	f	f
22	3	Payment Released	7	f	t
23	3	Rejected	8	f	t
24	4	Application Draft	1	t	f
25	4	Application Submitted	2	f	f
26	4	Document Verification	3	f	f
27	4	Field Enquiry	4	f	f
28	4	District Recommendation	5	f	f
29	4	State Sanction	6	f	f
30	4	Pension Approved	7	f	f
31	4	Pension Disbursed	8	f	t
32	4	Rejected	9	f	t
4	1	District Approval	5	f	f
5	1	State Approval	6	f	f
6	1	Approved	7	f	f
7	1	Rejected	8	f	t
8	1	Completed	9	f	t
9	1	Return to Applicant	4	t	f
10	2	Application Draft	2	f	f
11	2	Application Submitted	3	f	f
12	2	Return to Applicant	4	f	f
\.


--
-- Data for Name: workflow_tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workflow_tasks (task_id, application_id, state_id, assigned_to, assigned_office, task_status, priority, assigned_at, completed_at, due_date, remarks, assigned_role_id) FROM stdin;
77	53	11	1	1	Completed	Normal	2026-08-14 12:59:57.569212	2026-08-14 13:13:57.92833	\N	\N	5
79	54	2	1	1	Completed	Normal	2026-08-14 16:23:59.166806	2026-08-14 17:00:25.979487	\N	\N	5
78	53	13	2	1	Completed	Normal	2026-08-14 13:13:57.92833	2026-08-14 17:00:47.394133	\N	\N	6
80	54	4	2	1	Completed	Normal	2026-08-14 17:00:25.979487	2026-08-14 17:55:06.293086	\N	\N	6
82	56	11	1	1	Pending	Normal	2026-08-19 17:19:24.652863	\N	\N	\N	5
81	55	11	1	1	Completed	Normal	2026-08-19 17:15:47.927112	2026-08-20 17:04:24.562207	\N	\N	5
83	55	13	2	1	Pending	Normal	2026-08-20 17:04:24.562207	\N	\N	\N	6
\.


--
-- Data for Name: workflow_transitions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workflow_transitions (transition_id, workflow_id, from_state_id, to_state_id, action_id, role_id, is_active, remarks_required, attachment_required, sla_days, next_role_id) FROM stdin;
19	3	16	17	1	4	t	f	f	0	\N
21	3	18	19	2	9	t	f	f	0	\N
22	3	19	20	2	6	t	f	f	0	\N
23	3	20	21	2	7	t	f	f	0	\N
24	3	20	23	3	7	t	f	f	0	\N
25	3	23	18	6	4	t	f	f	0	\N
26	3	21	22	5	10	t	f	f	0	\N
27	4	24	25	1	4	t	f	f	0	\N
29	4	26	27	2	5	t	f	f	0	\N
30	4	26	32	3	5	t	f	f	0	\N
31	4	32	26	6	4	t	f	f	0	\N
32	4	27	28	5	8	t	f	f	0	\N
33	4	28	29	2	6	t	f	f	0	\N
34	4	29	30	2	7	t	f	f	0	\N
35	4	30	31	5	10	t	f	f	0	\N
36	4	29	32	3	7	t	f	f	0	\N
11	2	10	11	1	4	t	f	f	0	5
12	2	11	13	5	5	t	f	f	0	6
13	2	11	12	4	5	t	f	f	0	4
14	2	11	15	3	5	t	f	f	0	\N
15	2	13	14	2	6	t	f	f	0	\N
16	2	13	11	4	6	t	f	f	0	5
17	2	12	11	6	4	t	f	f	0	5
18	2	12	15	8	4	t	f	f	0	\N
38	2	13	15	3	6	t	f	f	0	\N
1	1	1	2	1	4	t	f	f	0	5
2	1	1	7	8	4	t	f	f	0	\N
3	1	2	7	4	5	t	f	f	0	4
4	1	2	4	5	5	t	f	f	0	6
5	1	2	7	3	5	t	f	f	0	\N
6	1	4	2	4	6	t	f	f	0	5
9	1	5	7	3	5	t	f	f	0	\N
10	1	6	8	5	5	t	f	f	0	\N
20	3	17	18	2	9	t	f	f	0	\N
28	4	25	26	2	5	t	f	f	0	\N
7	1	4	5	2	6	t	f	f	0	\N
\.


--
-- Name: applications_application_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.applications_application_id_seq', 89, true);


--
-- Name: applications_housing_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.applications_housing_id_seq', 37, true);


--
-- Name: attachments_attachment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attachments_attachment_id_seq', 1, false);


--
-- Name: menus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.menus_id_seq', 5, true);


--
-- Name: offices_office_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.offices_office_id_seq', 1, false);


--
-- Name: role_menus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_menus_id_seq', 11, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 2, true);


--
-- Name: services_service_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.services_service_id_seq', 3, true);


--
-- Name: student_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.student_id_seq', 9, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- Name: workflow_actions_action_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.workflow_actions_action_id_seq', 8, true);


--
-- Name: workflow_history_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.workflow_history_history_id_seq', 97, true);


--
-- Name: workflow_master_workflow_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.workflow_master_workflow_id_seq', 4, true);


--
-- Name: workflow_states_state_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.workflow_states_state_id_seq', 1, false);


--
-- Name: workflow_tasks_task_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.workflow_tasks_task_id_seq', 83, true);


--
-- Name: workflow_transitions_transition_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.workflow_transitions_transition_id_seq', 2, true);


--
-- Name: workflow_applications applications_application_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_applications
    ADD CONSTRAINT applications_application_no_key UNIQUE (application_no);


--
-- Name: applications_housing applications_housing_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications_housing
    ADD CONSTRAINT applications_housing_pkey PRIMARY KEY (id);


--
-- Name: workflow_applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (application_id);


--
-- Name: attachments attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_pkey PRIMARY KEY (attachment_id);


--
-- Name: boiler_applications boiler_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boiler_applications
    ADD CONSTRAINT boiler_applications_pkey PRIMARY KEY (id);


--
-- Name: menu_master menus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_master
    ADD CONSTRAINT menus_pkey PRIMARY KEY (id);


--
-- Name: offices offices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offices
    ADD CONSTRAINT offices_pkey PRIMARY KEY (office_id);


--
-- Name: role_menus role_menus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_menus
    ADD CONSTRAINT role_menus_pkey PRIMARY KEY (id);


--
-- Name: role_master roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_master
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: role_master roles_role_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_master
    ADD CONSTRAINT roles_role_name_key UNIQUE (role_name);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (service_id);


--
-- Name: services services_service_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_service_code_key UNIQUE (service_code);


--
-- Name: student student_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: workflow_actions workflow_actions_action_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_actions
    ADD CONSTRAINT workflow_actions_action_name_key UNIQUE (action_name);


--
-- Name: workflow_actions workflow_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_actions
    ADD CONSTRAINT workflow_actions_pkey PRIMARY KEY (action_id);


--
-- Name: workflow_history workflow_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_history
    ADD CONSTRAINT workflow_history_pkey PRIMARY KEY (history_id);


--
-- Name: workflow_master workflow_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_master
    ADD CONSTRAINT workflow_master_pkey PRIMARY KEY (workflow_id);


--
-- Name: workflow_states workflow_states_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_states
    ADD CONSTRAINT workflow_states_pkey PRIMARY KEY (state_id);


--
-- Name: workflow_tasks workflow_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_tasks
    ADD CONSTRAINT workflow_tasks_pkey PRIMARY KEY (task_id);


--
-- Name: workflow_transitions workflow_transitions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_transitions
    ADD CONSTRAINT workflow_transitions_pkey PRIMARY KEY (transition_id);


--
-- Name: workflow_applications fk_application_office; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_applications
    ADD CONSTRAINT fk_application_office FOREIGN KEY (office_id) REFERENCES public.offices(office_id);


--
-- Name: workflow_applications fk_application_state; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_applications
    ADD CONSTRAINT fk_application_state FOREIGN KEY (current_state_id) REFERENCES public.workflow_states(state_id);


--
-- Name: workflow_applications fk_application_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_applications
    ADD CONSTRAINT fk_application_user FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: workflow_applications fk_application_workflow; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_applications
    ADD CONSTRAINT fk_application_workflow FOREIGN KEY (workflow_id) REFERENCES public.workflow_master(workflow_id);


--
-- Name: attachments fk_attachment_application; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT fk_attachment_application FOREIGN KEY (application_id) REFERENCES public.workflow_applications(application_id) ON DELETE CASCADE;


--
-- Name: attachments fk_attachment_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT fk_attachment_user FOREIGN KEY (uploaded_by) REFERENCES public.users(id);


--
-- Name: boiler_applications fk_boiler_application; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boiler_applications
    ADD CONSTRAINT fk_boiler_application FOREIGN KEY (id) REFERENCES public.workflow_applications(application_id) ON DELETE CASCADE;


--
-- Name: workflow_history fk_history_action; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_history
    ADD CONSTRAINT fk_history_action FOREIGN KEY (action_id) REFERENCES public.workflow_actions(action_id);


--
-- Name: workflow_history fk_history_application; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_history
    ADD CONSTRAINT fk_history_application FOREIGN KEY (application_id) REFERENCES public.workflow_applications(application_id);


--
-- Name: workflow_history fk_history_from; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_history
    ADD CONSTRAINT fk_history_from FOREIGN KEY (from_state_id) REFERENCES public.workflow_states(state_id);


--
-- Name: workflow_history fk_history_office; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_history
    ADD CONSTRAINT fk_history_office FOREIGN KEY (performed_office) REFERENCES public.offices(office_id);


--
-- Name: workflow_history fk_history_task; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_history
    ADD CONSTRAINT fk_history_task FOREIGN KEY (task_id) REFERENCES public.workflow_tasks(task_id);


--
-- Name: workflow_history fk_history_to; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_history
    ADD CONSTRAINT fk_history_to FOREIGN KEY (to_state_id) REFERENCES public.workflow_states(state_id);


--
-- Name: workflow_history fk_history_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_history
    ADD CONSTRAINT fk_history_user FOREIGN KEY (performed_by) REFERENCES public.users(id);


--
-- Name: users fk_role; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES public.role_master(id);


--
-- Name: services fk_services_workflow; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT fk_services_workflow FOREIGN KEY (workflow_id) REFERENCES public.workflow_master(workflow_id);


--
-- Name: workflow_tasks fk_task_application; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_tasks
    ADD CONSTRAINT fk_task_application FOREIGN KEY (application_id) REFERENCES public.workflow_applications(application_id) ON DELETE CASCADE;


--
-- Name: workflow_tasks fk_task_office; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_tasks
    ADD CONSTRAINT fk_task_office FOREIGN KEY (assigned_office) REFERENCES public.offices(office_id);


--
-- Name: workflow_tasks fk_task_state; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_tasks
    ADD CONSTRAINT fk_task_state FOREIGN KEY (state_id) REFERENCES public.workflow_states(state_id);


--
-- Name: workflow_tasks fk_task_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_tasks
    ADD CONSTRAINT fk_task_user FOREIGN KEY (assigned_to) REFERENCES public.users(id);


--
-- Name: workflow_transitions fk_transition_action; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_transitions
    ADD CONSTRAINT fk_transition_action FOREIGN KEY (action_id) REFERENCES public.workflow_actions(action_id);


--
-- Name: workflow_transitions fk_transition_from_state; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_transitions
    ADD CONSTRAINT fk_transition_from_state FOREIGN KEY (from_state_id) REFERENCES public.workflow_states(state_id);


--
-- Name: workflow_transitions fk_transition_role; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_transitions
    ADD CONSTRAINT fk_transition_role FOREIGN KEY (role_id) REFERENCES public.role_master(id);


--
-- Name: workflow_transitions fk_transition_to_state; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_transitions
    ADD CONSTRAINT fk_transition_to_state FOREIGN KEY (to_state_id) REFERENCES public.workflow_states(state_id);


--
-- Name: workflow_transitions fk_transition_workflow; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_transitions
    ADD CONSTRAINT fk_transition_workflow FOREIGN KEY (workflow_id) REFERENCES public.workflow_master(workflow_id) ON DELETE CASCADE;


--
-- Name: workflow_states fk_workflow_states_workflow; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_states
    ADD CONSTRAINT fk_workflow_states_workflow FOREIGN KEY (workflow_id) REFERENCES public.workflow_master(workflow_id) ON DELETE CASCADE;


--
-- Name: role_menus role_menus_menu_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_menus
    ADD CONSTRAINT role_menus_menu_id_fkey FOREIGN KEY (menu_id) REFERENCES public.menu_master(id);


--
-- Name: role_menus role_menus_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_menus
    ADD CONSTRAINT role_menus_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role_master(id);


--
-- PostgreSQL database dump complete
--

