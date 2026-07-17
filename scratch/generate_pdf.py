import os
from fpdf import FPDF

class AptitudePDF(FPDF):
    def header(self):
        if self.page_no() == 1:
            return  # Skip header on cover page
        self.set_font('helvetica', 'B', 10)
        self.set_text_color(59, 130, 246)  # Blue
        self.cell(0, 10, '100 APTITUDE QUESTIONS & ANSWERS - CAMPUS PLACEMENTS PREPARATION', border='B', align='L')
        self.set_font('helvetica', '', 9)
        self.set_text_color(156, 163, 175)
        self.cell(0, 10, 'AI Resume Analyzer', align='R')
        self.ln(15)

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(156, 163, 175)
        self.cell(0, 10, f'Page {self.page_no()}/{{nb}}', align='C')
        self.cell(0, 10, 'Confidential & For Practice Only', align='R')

def build_questions():
    questions = []
    
    # 1. QUANTITATIVE APTITUDE: Questions 1 to 40
    for i in range(1, 41):
        if i % 5 == 1:
            q_text = f"If the price of a commodity increases by {10 + i}%, by what percent must a consumer reduce the consumption of the commodity so that his expenditure remains constant?"
            val = 10 + i
            ans_val = (val / (100 + val)) * 100
            options = [
                f"A) {ans_val - 2:.2f}%",
                f"B) {ans_val:.2f}%",
                f"C) {ans_val + 1.5:.2f}%",
                f"D) {ans_val + 3:.2f}%"
            ]
            correct = "B"
            expl = f"Formula: Reduction% = [R / (100 + R)] * 100. Here R = {val}%. Reduction = [{val} / {100 + val}] * 100 = {ans_val:.2f}%."
        elif i % 5 == 2:
            a_work = 10 + (i % 3) * 2
            b_work = 15 + (i % 4) * 3
            total_work = a_work * b_work
            eff_a = b_work
            eff_b = a_work
            together_days = total_work / (eff_a + eff_b)
            q_text = f"A can complete a work in {a_work} days and B can complete the same work in {b_work} days. How many days will they take to complete the work working together?"
            options = [
                f"A) {together_days - 0.5:.2f} days",
                f"B) {together_days + 0.8:.2f} days",
                f"C) {together_days:.2f} days",
                f"D) {together_days + 1.2:.2f} days"
            ]
            correct = "C"
            expl = f"Using LCM method: Total Work = LCM({a_work}, {b_work}) = {total_work}. Efficiency of A = {eff_a}, B = {eff_b}. Combined efficiency = {eff_a + eff_b}. Days required = {total_work} / {eff_a + eff_b} = {together_days:.2f} days."
        elif i % 5 == 3:
            speed = 30 + i
            time_hours = 2 + (i % 3)
            dist = speed * time_hours
            new_speed = speed + 10
            new_time = dist / new_speed
            q_text = f"A car travels at a speed of {speed} km/h and covers a distance in {time_hours} hours. If the speed is increased to {new_speed} km/h, how much time will it take to cover the same distance?"
            options = [
                f"A) {new_time:.2f} hours",
                f"B) {new_time + 0.5:.2f} hours",
                f"C) {new_time - 0.25:.2f} hours",
                f"D) {new_time + 1.0:.2f} hours"
            ]
            correct = "A"
            expl = f"Distance = Speed * Time = {speed} * {time_hours} = {dist} km. New Speed = {new_speed} km/h. New Time = Distance / New Speed = {dist} / {new_speed} = {new_time:.2f} hours."
        elif i % 5 == 4:
            cost = 200 + i * 5
            profit_pct = 10 + (i % 3) * 5
            sp = cost * (1 + profit_pct / 100)
            q_text = f"A merchant buys an item for ${cost}. At what price should he sell the item to gain a profit of {profit_pct}%?"
            options = [
                f"A) ${sp - 10:.2f}",
                f"B) ${sp + 15:.2f}",
                f"C) ${sp:.2f}",
                f"D) ${sp - 5:.2f}"
            ]
            correct = "C"
            expl = f"Profit = {profit_pct}% of ${cost} = ${(profit_pct/100)*cost:.2f}. Selling Price = Cost Price + Profit = ${cost} + ${(profit_pct/100)*cost:.2f} = ${sp:.2f}."
        else:
            term1 = i
            term2 = i * 2
            ratio_str = f"{term1}:{term2} (or 1:2)"
            sum_val = term1 + term2 + i
            q_text = f"Two numbers are in the ratio 1:2. If {i} is added to both numbers, their ratio becomes 2:3. Find the sum of the original numbers."
            options = [
                f"A) {sum_val * 2}",
                f"B) {sum_val - i}",
                f"C) {sum_val}",
                f"D) {sum_val + i * 2}"
            ]
            correct = "C"
            expl = f"Let numbers be x and 2x. Given: (x + {i}) / (2x + {i}) = 2/3. Solving this: 3(x + {i}) = 2(2x + {i}) => 3x + {i*3} = 4x + {i*2} => x = {i}. Numbers are {i} and {i*2}. Sum = {i + i*2} = {sum_val}."
            
        questions.append({
            "num": i,
            "category": "Quantitative Aptitude",
            "question": q_text,
            "options": options,
            "correct": correct,
            "explanation": expl
        })
        
    # 2. LOGICAL REASONING: Questions 41 to 70
    for i in range(41, 71):
        if i % 3 == 1:
            diff = i - 35
            series = [5, 5 + diff, 5 + diff * 2, 5 + diff * 3, 5 + diff * 4]
            next_term = 5 + diff * 5
            q_text = f"Find the next number in the series: {', '.join(map(str, series))}, ?"
            options = [
                f"A) {next_term - 2}",
                f"B) {next_term}",
                f"C) {next_term + diff}",
                f"D) {next_term + 4}"
            ]
            correct = "B"
            expl = f"The series increases by a constant difference of {diff} at each step. Next term is {series[-1]} + {diff} = {next_term}."
        elif i % 3 == 2:
            shift = (i % 4) + 1
            word = "HELLO"
            coded = "".join(chr((ord(c) - 65 + shift) % 26 + 65) for c in word)
            target = "WORLD"
            coded_target = "".join(chr((ord(c) - 65 + shift) % 26 + 65) for c in target)
            q_text = f"If in a certain code language '{word}' is written as '{coded}', how will '{target}' be written in that code language?"
            options = [
                f"A) {coded_target[:3] + 'XX'}",
                f"B) {coded_target}",
                f"C) {coded_target[:-1] + 'Z'}",
                f"D) {coded_target[0] + 'ABC' + coded_target[-1]}"
            ]
            correct = "B"
            expl = f"Each letter of the word is shifted forward by {shift} characters. W(+{shift})->{coded_target[0]}, O(+{shift})->{coded_target[1]}, R(+{shift})->{coded_target[2]}, L(+{shift})->{coded_target[3]}, D(+{shift})->{coded_target[4]}. Result = {coded_target}."
        else:
            q_text = f"Pointing to a man, a woman says, 'His mother is the only daughter of my father.' How is the woman related to the man?"
            options = [
                "A) Grandmother",
                "B) Sister",
                "C) Mother",
                "D) Aunt"
            ]
            correct = "C"
            expl = "The woman's father's only daughter is the woman herself. Her mother is the woman. Thus, the woman is the man's mother."
            
        questions.append({
            "num": i,
            "category": "Logical Reasoning",
            "question": q_text,
            "options": options,
            "correct": correct,
            "explanation": expl
        })

    # 3. VERBAL ABILITY: Questions 71 to 100
    prepositions = ["at", "on", "in", "by", "with", "for", "to", "about", "into", "through"]
    for i in range(71, 101):
        if i % 3 == 1:
            prep = prepositions[i % len(prepositions)]
            q_text = f"Complete the sentence with the correct preposition: 'She has been working in this office for the last {i - 65} months.'"
            options = [
                "A) since",
                "B) for",
                "C) from",
                "D) during"
            ]
            correct = "B"
            expl = "We use 'for' to denote a duration of time (e.g. for the last X months), whereas 'since' is used for a specific starting point in time."
        elif i % 3 == 2:
            q_text = f"Find the error in the sentence: 'Neither the manager (A) / nor the employees (B) / was present at the meeting (C) / yesterday (D).'"
            options = [
                "A) Part A",
                "B) Part B",
                "C) Part C",
                "D) Part D"
            ]
            correct = "C"
            expl = "Rule of Proximity: 'nor employees' is plural, so the verb should be plural 'were present' instead of 'was present'."
        else:
            q_text = f"Choose the word that is closest in meaning (synonym) to 'ABUNDANT':"
            options = [
                "A) Scarcity",
                "B) Plentiful",
                "C) Sparse",
                "D) Deficient"
            ]
            correct = "B"
            expl = "Abundant means existing or available in large quantities; overflowing. 'Plentiful' is the closest synonym."

        questions.append({
            "num": i,
            "category": "Verbal Ability",
            "question": q_text,
            "options": options,
            "correct": correct,
            "explanation": expl
        })

    return questions

def generate_pdf():
    pdf = AptitudePDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.alias_nb_pages()
    
    # Page 1: COVER PAGE
    pdf.add_page()
    pdf.set_fill_color(249, 250, 251)  # Light BG
    pdf.rect(0, 0, 210, 297, 'F')
    
    # Accent bar
    pdf.set_fill_color(59, 130, 246)  # Blue
    pdf.rect(0, 0, 15, 297, 'F')
    
    pdf.set_left_margin(25)
    pdf.ln(50)
    pdf.set_font('helvetica', 'B', 28)
    pdf.set_text_color(17, 24, 39)
    pdf.multi_cell(0, 12, '100 Aptitude\nQuestions & Answers')
    pdf.ln(10)
    
    pdf.set_font('helvetica', 'B', 14)
    pdf.set_text_color(59, 130, 246)
    pdf.cell(0, 10, 'A Complete Campus Placement Preparation Guide', new_x="LMARGIN", new_y="NEXT")
    pdf.ln(20)
    
    pdf.set_font('helvetica', '', 11)
    pdf.set_text_color(75, 85, 99)
    features = [
        "- 40 Quantitative Aptitude Questions with Shortcut Explanations",
        "- 30 Logical Reasoning Questions with Pattern Breakdown",
        "- 30 Verbal Ability Questions emphasizing Core Grammar Rules",
        "- Designed for campus recruitment elimination rounds",
        "- Includes step-by-step solutions for self-assessment"
    ]
    for feat in features:
        pdf.cell(0, 8, feat, new_x="LMARGIN", new_y="NEXT")
    
    pdf.ln(40)
    pdf.set_font('helvetica', 'I', 10)
    pdf.set_text_color(156, 163, 175)
    pdf.cell(0, 6, 'Generated by AI Resume Analyzer Placement Guide Module', new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 6, 'Date: June 2026', new_x="LMARGIN", new_y="NEXT")
    
    # Reset Margin
    pdf.set_left_margin(15)
    
    # Page 2: QUESTIONS
    pdf.add_page()
    questions = build_questions()
    
    current_category = ""
    for q in questions:
        # Category header
        if q["category"] != current_category:
            current_category = q["category"]
            pdf.ln(5)
            pdf.set_font('helvetica', 'B', 14)
            pdf.set_text_color(17, 24, 39)
            pdf.set_fill_color(243, 244, 246)
            pdf.cell(0, 10, f" SECTION: {current_category.upper()} ", border=0, new_x="LMARGIN", new_y="NEXT", fill=True)
            pdf.ln(5)
            
        pdf.set_font('helvetica', 'B', 11)
        pdf.set_text_color(17, 24, 39)
        pdf.multi_cell(0, 6, f"Q{q['num']}. {q['question']}")
        
        pdf.set_font('helvetica', '', 10)
        pdf.set_text_color(55, 65, 81)
        pdf.ln(2)
        
        # Display options in two columns if short, else line by line
        for opt in q["options"]:
            pdf.cell(90, 6, f"  {opt}")
        pdf.ln(7)
        
        pdf.set_font('helvetica', 'B', 9)
        pdf.set_text_color(16, 185, 129)  # Emerald
        pdf.cell(30, 5, f"Correct Answer: {q['correct']}")
        pdf.set_font('helvetica', '', 9)
        pdf.set_text_color(107, 114, 128)  # Gray
        pdf.cell(0, 5, f"Explanation: {q['explanation']}", new_x="LMARGIN", new_y="NEXT")
        
        pdf.ln(6)
        
    # Output file
    dest_path1 = "c:/Users/sushanth/AI RESUME/frontend/public/100 Aptitude Questions & Answers.pdf"
    dest_path2 = "c:/Users/sushanth/AI RESUME/resources/public/100 Aptitude Questions & Answers.pdf"
    
    # Ensure directories exist
    os.makedirs(os.path.dirname(dest_path1), exist_ok=True)
    os.makedirs(os.path.dirname(dest_path2), exist_ok=True)
    
    pdf.output(dest_path1)
    pdf.output(dest_path2)
    print(f"Successfully generated PDF files:\n- {dest_path1}\n- {dest_path2}")

if __name__ == "__main__":
    generate_pdf()
