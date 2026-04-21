#!/usr/bin/env python3
"""
Cover Letter Generator for Morgan Hirosky
Usage:
  python cover_letter.py                  # prompts for job description interactively
  python cover_letter.py -f job.txt       # reads job description from a file
  python cover_letter.py -o output.txt    # saves cover letter to a file
"""

import anthropic
import argparse
import sys
from datetime import date

RESUME = """
Name: Morgan Hirosky
Contact: (214)762-5883 | morghirosky@gmail.com
Education: Bachelor of Arts in Journalism (Minor in Psychology), Texas State University, San Marcos TX — Cum Laude, May 2023

EXPERIENCE:

Lead Writer — Texas Senate, Austin TX (January 2024 – Present)
- Drafted 500+ Senate proclamations and resolutions on behalf of all 31 Texas Senators
- Executed high-volume writing, editing, and proofreading under accelerated deadlines
- Translated complex policy, historical, and biographical material into precise legislative language
- Analyzed thousands of documents for technical errors and accurate details
- Served during 2025: Regular Session, 1st Special Session, and 2nd Special Session

Editor — KTSW-FM 89.9, San Marcos TX (May 2021 – May 2023)
- Directed editorial vision and upheld creative standards for the station's digital publication
- Mentored contributing writers, strengthening narrative clarity, structural cohesion, and voice
- Evaluated and refined story pitches, elevating long-form storytelling organization and focus
- Optimized articles for SEO and monitored analytics to inform content strategy
- Revised and edited articles for daily publication

Assistant Director — KTSW-FM 89.9, San Marcos TX (May 2020 – May 2022)
- Curated original creative concepts to expand the publication's artistic scope
- Identified emerging trends and niche subcultures to improve relevancy to audience
- Wrote and published original articles without oversight
- Represented publication in media partnerships and community events
- Awarded station's Article of the Year: "Rabbits of the 90s: A Niche's Core"
- Employee of the Month and Article of the Month (October 2022)

Journalist & Ghostwriter — Freelance, Remote (2020 – Present)
- Collaborated with clients to establish priorities and positions of assignment
- Wrote original content for outlets such as Game Rant and Boerne Lifestyle Magazine
- Ghostwrote and edited full-length manuscripts for independent authors via Reedsy
- Provided structural editing and stylistic revision for fiction and nonfiction projects
- Member of the International Association of Freelance Writers

Social Media Strategist — Polar Culture, Remote (March 2020 – January 2021)
- Developed content strategy for an emerging artist under contract
- Leveraged analytics, SEO, and algorithmic insights to optimize engagement
- Increased follower base by 1,956% in ten months (1,600 to 32,900)
- Designed promotional graphics and digital campaign assets

SKILLS:
Editing, Proofreading, Semantic Analysis, Manuscript Evaluation, Grammar & Syntax Mastery,
Feature Writing, Editorial Writing, Technical Writing, Copywriting, Creative Writing,
Idea Curation, Videography, Photography, Audiography, Interviewing, Graphic Design,
Web Design, Social Media Strategy, Microsoft Office Suite, Adobe Creative Cloud

SOLO PROJECTS:
- Dead Bugs (2022): Documentary trailer — faceless interviews exploring identity and self-concept. Filmed on Canon XF300, edited in Adobe Premiere Pro.
- Life as Death's Keeper (2023): Long-form journalism project on morticians' perspectives on mortality and meaning. Shot on Canon EOS, edited in Adobe Photoshop.
"""

SYSTEM_PROMPT = f"""You are writing cover letters on behalf of Morgan Hirosky, a writer and editor based in Texas.

Today's date is {date.today().strftime("%B %d, %Y")}.

Here is Morgan's resume:
{RESUME}

When writing a cover letter:
- Write in first person as Morgan
- Match specific skills and experiences from the resume to what the job description asks for
- Lead with the most relevant credential for this specific role
- Keep it to 3–4 paragraphs: hook, relevant experience, why this company/role, close
- Be confident and specific — avoid generic phrases like "I am a hard worker" or "I am passionate about"
- Use concrete details and numbers from the resume when relevant (500+ proclamations, 1,956% growth, etc.)
- Tone: professional but human — not stiff, not casual
- Do NOT include a header/address block — just the body of the letter starting with the salutation
- End with "Sincerely," followed by a blank line and "Morgan Hirosky"
- If the hiring manager's name is not provided, use "Hiring Manager"
"""

def get_job_description(args):
    if args.file:
        with open(args.file, "r") as f:
            return f.read().strip()

    print("Paste the job description below.")
    print("When done, press Enter then Ctrl+D (Mac/Linux) or Ctrl+Z then Enter (Windows):\n")
    lines = sys.stdin.readlines()
    return "".join(lines).strip()

def generate_cover_letter(job_description, hiring_manager=None):
    client = anthropic.Anthropic()

    user_message = f"Write a cover letter for the following job posting."
    if hiring_manager:
        user_message += f" The hiring manager's name is {hiring_manager}."
    user_message += f"\n\nJOB DESCRIPTION:\n{job_description}"

    message = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}]
    )

    return message.content[0].text

def main():
    parser = argparse.ArgumentParser(description="Generate a tailored cover letter for Morgan Hirosky")
    parser.add_argument("-f", "--file", help="Path to a .txt file containing the job description")
    parser.add_argument("-o", "--output", help="Path to save the cover letter (optional)")
    parser.add_argument("-m", "--manager", help="Hiring manager's name (optional)")
    args = parser.parse_args()

    print("Reading job description...")
    job_description = get_job_description(args)

    if not job_description:
        print("Error: No job description provided.")
        sys.exit(1)

    print("\nGenerating cover letter...\n")
    cover_letter = generate_cover_letter(job_description, args.manager)

    print("=" * 60)
    print(cover_letter)
    print("=" * 60)

    if args.output:
        with open(args.output, "w") as f:
            f.write(cover_letter)
        print(f"\nSaved to {args.output}")

if __name__ == "__main__":
    main()
