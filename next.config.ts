import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Github, Linkedin, Mail, Download, Cpu, Bot, CircuitBoard, Wrench, FileCode, Send } from "lucide-react";

// ---- Content you can edit quickly ----
const NAME = "Nikhil Thankasala"; // change if needed
const TAGLINE = "Robotics • Embedded Systems • Mechatronics";
const SUMMARY = `Robotics engineering student at UC Santa Cruz (minor in EE). I build end‑to‑end systems: sensing, perception, control, and clean embedded software. Experienced with HSM architectures, PIC32/Arduino, ROS2, and FPGA/Verilog. Currently seeking Fall/Spring 2025 internships.`;

const LINKS = {
  github: "https://github.com/", // add your profile
  linkedin: "https://www.linkedin.com/in/", // add your profile
  email: "mailto:youremail@example.com",
  resume: "/resume.pdf", // drop your PDF at public/resume.pdf when deploying
};

const SKILLS = [
  "C", "C++", "Python", "Embedded C", "Verilog", "FPGA", "PIC32", "Arduino",
  "ROS2", "Gazebo", "MoveIt", "Navigation2", "OpenCV", "PyTorch",
  "UART", "I2C", "SPI", "PWM", "PID", "State Machines", "ES_Framework",
  "SolidWorks", "Fusion 360", "3D Printing", "Soldering", "Oscilloscope",
];

// Showcase projects—edit freely
const PROJECTS = [
  {
    title: "Autonomous WALL‑E Robot",
    stack: ["C", "PIC32", "Ultrasonic", "IR", "TCS3200", "HSM"],
    blurb:
      "End‑to‑end autonomous mobile robot that detects, classifies, and sorts colored blocks using a hierarchical state machine. Integrated TCS3200 color sensing, ultrasonic ranging, IR line following, and robust event handling.",
    bullets: [
      "100‑sample object verification with timeouts to reduce false positives",
      "Color‑based grasp and zone drop‑off logic with green‑block exception handling",
      "Modular services and event checkers within ES_Framework",
    ],
    image: "https://images.unsplash.com/photo-1581092921461-1f2b1badd8b0?auto=format&fit=crop&w=1200&q=60",
    link: LINKS.github,
  },
  {
    title: "FPGA Mini‑SoC & Verilog Exercises",
    stack: ["Verilog", "FPGA", "RISC‑V"],
    blurb:
      "Collection of RTL modules and a small soft‑core bring‑up. Focus on clean interfaces, testbenches, and timing‑aware design.",
    bullets: [
      "Wrote synthesizable modules with parameterized widths",
      "Created simulation testbenches and basic constrained‑random checks",
      "Explored bus interfacing and memory‑mapped IO",
    ],
    image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1200&q=60",
    link: LINKS.github,
  },
  {
    title: "Microcontroller Game Suite",
    stack: ["C", "PIC32", "UART", "Interrupts"],
    blurb:
      "Battleship, oven timer, and a tiny RPG built on PIC32 with event‑driven architecture and UART debugging.",
    bullets: [
      "Interrupt‑driven input and timing",
      "Finite state machines for gameplay flow",
      "Serial logging for rapid debugging",
    ],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=60",
    link: LINKS.github,
  },
];

const EXPERIENCE = [
  {
    role: "Coding Instructor (Part‑time)",
    org: "—",
    time: "2024 — Present",
    points: [
      "Taught fundamentals of Python and C to beginners with hands‑on microcontroller labs",
      "Mentored students on debugging and project scoping",
    ],
  },
];

// ---- UI Helpers ----
const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function Section({ id, title, icon, children }: { id: string; title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} className="max-w-6xl mx-auto px-5 md:px-8 py-12 md:py-16">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={fadeIn}>
        <div className="flex items-center gap-3 mb-6">
          {icon}
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
        </div>
        {children}
      </motion.div>
    </section>
  );
}

function ChipList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((s, i) => (
        <Badge key={i} className="text-sm px-3 py-1 rounded-2xl">{s}</Badge>
      ))}
    </div>
  );
}

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/50 border-b">
        <nav className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <a href="#home" className="font-semibold tracking-tight">{NAME}</a>
          <div className="hidden sm:flex items-center gap-2">
            <a href="#projects" className="px-3 py-2 text-sm rounded-xl hover:bg-slate-100">Projects</a>
            <a href="#skills" className="px-3 py-2 text-sm rounded-xl hover:bg-slate-100">Skills</a>
            <a href="#experience" className="px-3 py-2 text-sm rounded-xl hover:bg-slate-100">Experience</a>
            <a href="#about" className="px-3 py-2 text-sm rounded-xl hover:bg-slate-100">About</a>
            <a href="#contact" className="px-3 py-2 text-sm rounded-xl hover:bg-slate-100">Contact</a>
            <a href={LINKS.resume} className="ml-2">
              <Button size="sm" className="rounded-2xl"><Download className="mr-2 h-4 w-4"/>Resume</Button>
            </a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section id="home" className="max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">Hi, I’m {NAME}.</h1>
            <p className="mt-4 text-lg md:text-xl text-slate-600">{TAGLINE}</p>
            <p className="mt-4 text-slate-600 max-w-prose">{SUMMARY}</p>
            <div className="mt-6 flex gap-3">
              <a href={LINKS.github} target="_blank" rel="noreferrer"><Button variant="outline" className="rounded-2xl"><Github className="mr-2 h-4 w-4"/>GitHub</Button></a>
              <a href={LINKS.linkedin} target="_blank" rel="noreferrer"><Button variant="outline" className="rounded-2xl"><Linkedin className="mr-2 h-4 w-4"/>LinkedIn</Button></a>
              <a href={LINKS.email}><Button className="rounded-2xl"><Mail className="mr-2 h-4 w-4"/>Email</Button></a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="rounded-2xl shadow-sm"><CardContent className="p-6 flex items-center gap-4"><Bot/><div><div className="font-semibold">Autonomy</div><div className="text-sm text-slate-600">HSM, sensing, control</div></div></CardContent></Card>
            <Card className="rounded-2xl shadow-sm"><CardContent className="p-6 flex items-center gap-4"><CircuitBoard/><div><div className="font-semibold">Embedded</div><div className="text-sm text-slate-600">PIC32, UART/I2C/SPI</div></div></CardContent></Card>
            <Card className="rounded-2xl shadow-sm"><CardContent className="p-6 flex items-center gap-4"><Cpu/><div><div className="font-semibold">FPGA</div><div className="text-sm text-slate-600">Verilog, RTL, test</div></div></CardContent></Card>
            <Card className="rounded-2xl shadow-sm"><CardContent className="p-6 flex items-center gap-4"><Wrench/><div><div className="font-semibold">Mech</div><div className="text-sm text-slate-600">CAD, 3D print</div></div></CardContent></Card>
          </div>
        </motion.div>
      </section>

      {/* Projects */}
      <Section id="projects" title="Projects" icon={<FileCode className="h-6 w-6"/>}>
        <div className="grid md:grid-cols-3 gap-6">
          {PROJECTS.map((p, i) => (
            <Card key={i} className="rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-[16/9] bg-slate-200" style={{
                backgroundImage: `url(${p.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }} />
              <CardHeader>
                <CardTitle className="text-lg">{p.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ChipList items={p.stack} />
                <p className="text-sm text-slate-700">{p.blurb}</p>
                <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                  {p.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
                <div className="pt-2">
                  <a href={p.link} target="_blank" rel="noreferrer"><Button variant="outline" size="sm" className="rounded-2xl">View code</Button></a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Skills */}
      <Section id="skills" title="Skills" icon={<CircuitBoard className="h-6 w-6"/>}>
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <ChipList items={SKILLS} />
          </CardContent>
        </Card>
      </Section>

      {/* Experience */}
      <Section id="experience" title="Experience" icon={<Wrench className="h-6 w-6"/>}>
        <div className="grid md:grid-cols-2 gap-6">
          {EXPERIENCE.map((e, i) => (
            <Card key={i} className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">{e.role}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-slate-600">{e.org} • {e.time}</div>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                  {e.points.map((pt, j) => <li key={j}>{pt}</li>)}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* About */}
      <Section id="about" title="About" icon={<Bot className="h-6 w-6"/>}>
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          <Card className="md:col-span-2 rounded-2xl">
            <CardContent className="p-6 space-y-3 text-slate-700">
              <p>
                I like building robots that actually ship. My work spans sensors and drivers, control, and clean state machines, with just enough mechanical and CAD to make it real.
              </p>
              <p>
                At UCSC I focused on embedded systems and autonomy. I’ve integrated ultrasonic, IR, and color sensors, tuned motion, and hardened event logic under noise.
              </p>
              <p>
                In the near term I’m looking for teams where I can contribute quickly on embedded/controls and learn from senior engineers shipping real hardware.
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <a className="block" href={LINKS.resume}><Button className="w-full rounded-2xl" variant="outline"><Download className="mr-2 h-4 w-4"/> Download Resume</Button></a>
              <a className="block" href={LINKS.github} target="_blank" rel="noreferrer"><Button className="w-full rounded-2xl" variant="outline"><Github className="mr-2 h-4 w-4"/> GitHub</Button></a>
              <a className="block" href={LINKS.linkedin} target="_blank" rel="noreferrer"><Button className="w-full rounded-2xl" variant="outline"><Linkedin className="mr-2 h-4 w-4"/> LinkedIn</Button></a>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact" title="Contact" icon={<Mail className="h-6 w-6"/>}>
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <form className="grid md:grid-cols-3 gap-4" action={LINKS.email}>
              <Input placeholder="Your name" required className="rounded-2xl" />
              <Input type="email" placeholder="Your email" required className="rounded-2xl" />
              <Input placeholder="Subject" className="rounded-2xl" />
              <div className="md:col-span-3">
                <Textarea placeholder="Message" className="min-h-[140px] rounded-2xl" />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <Button type="submit" className="rounded-2xl"><Send className="mr-2 h-4 w-4"/>Send</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </Section>

      {/* Footer */}
      <footer className="py-10 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} {NAME}. Built with React, Tailwind, and shadcn/ui.
      </footer>
    </div>
  );
}
