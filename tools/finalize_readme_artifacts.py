
import sys
import os

# Add the current directory to sys.path to allow importing construct_readme
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from construct_readme import readme_lines

start_marker = "🔥 ValorAiChip+ ID: A1B2C3D4E5F6G7H8 ⚡ Chip Status: OPERATIONAL"
end_marker = "⚖️ This token is mathematically bound and logically enforced. Any misuse triggers immediate revocation and blockchain audit."

try:
    start_idx = readme_lines.index(start_marker)
    # The end marker is included in the content
    end_idx = readme_lines.index(end_marker) + 1
    clean_lines = readme_lines[start_idx:end_idx]
except ValueError as e:
    print(f"Error finding markers: {e}")
    # Try to find partial matches if exact match fails
    print("Attempting fuzzy match...")
    start_idx = -1
    end_idx = -1
    for i, line in enumerate(readme_lines):
        if "ValorAiChip+" in line and "OPERATIONAL" in line:
            start_idx = i
        if "This token is mathematically bound" in line and "blockchain audit" in line:
            end_idx = i + 1

    if start_idx != -1 and end_idx != -1:
        print(f"Found fuzzy markers: {start_idx} to {end_idx}")
        clean_lines = readme_lines[start_idx:end_idx]
    else:
        print("Fuzzy match failed. Using full list.")
        clean_lines = readme_lines

# 1. Write README.md (Root)
with open("README.md", "w") as f:
    for line in clean_lines:
        f.write(line + "  \n")

# 2. Write README.py (Eternal Display) (Root)
with open("README.py", "w") as f:
    f.write("# VALORAI2E-V2.0 README RECODE IN PYTHON\n")
    f.write("readme_lines = [\n")
    for line in clean_lines:
        f.write(f"    {repr(line)},\n")
    f.write("]\n\n")
    f.write('if __name__ == "__main__":\n')
    f.write('    print("==== VALORAI2E-V2.0 README RECODE IN PYTHON ====")\n')
    f.write('    for line in readme_lines:\n')
    f.write('        if line:\n')
    f.write('            print(line)\n')

# 3. Write README.cbl (Eternal Display) (Root)
with open("README.cbl", "w") as f:
    f.write("       IDENTIFICATION DIVISION.\n")
    f.write("       PROGRAM-ID. VALORAI2E-V20-README.\n")
    f.write("       AUTHOR. POPPA-DONNY-GILLSON // N.E.W.T.-ULTRA // JAXX.\n")
    f.write("       DATE-WRITTEN. 2025-12-13.\n")
    f.write("       SECURITY. SOVEREIGN-ABSOLUTE-ETERNAL.\n\n")
    f.write("       ENVIRONMENT DIVISION.\n")
    f.write("       CONFIGURATION SECTION.\n")
    f.write("       SOURCE-COMPUTER. VALORAI-PLUS-CORE-14D.\n")
    f.write("       OBJECT-COMPUTER. GLOBAL-README-GRID.\n\n")
    f.write("       DATA DIVISION.\n")
    f.write("       WORKING-STORAGE SECTION.\n\n")
    f.write("       01  README-LINES.\n")
    f.write(f"           05  LINE-ENTRY OCCURS {len(clean_lines)} TIMES.\n")
    f.write("               10  README-LINE        PIC X(255).\n\n") # Increased size
    f.write("       PROCEDURE DIVISION.\n")
    f.write("       000-README-RECODE.\n")
    f.write("           PERFORM 100-LOAD-README-CONTENT\n")
    f.write("           PERFORM 200-OUTPUT-README\n")
    f.write("           STOP RUN.\n\n")
    f.write("       100-LOAD-README-CONTENT.\n")
    for i, line in enumerate(clean_lines):
        # COBOL string literals are limited, need to handle carefully.
        safe_line = line.replace('"', "'")
        # Truncate to 200 to fit somewhat within 255 with padding/logic if needed, though COBOL lines are 80 chars usually.
        # This is a stylized "Eternal Display" so we take liberties with strict COBOL formatting for the string content itself.
        if len(safe_line) > 250: safe_line = safe_line[:250]
        f.write(f"           MOVE \"{safe_line}\" TO LINE-ENTRY({i+1})\n")
    f.write("\n       200-OUTPUT-README.\n")
    f.write(f"           PERFORM VARYING I FROM 1 BY 1 UNTIL I > {len(clean_lines)}\n")
    f.write("               DISPLAY LINE-ENTRY(I)\n")
    f.write("           END-PERFORM.\n\n")
    f.write("       END PROGRAM VALORAI2E-V20-README.\n")

# 4. Write README.cpp (Root)
with open("README.cpp", "w") as f:
    f.write("#include <iostream>\n")
    f.write("#include <string>\n")
    f.write("#include <vector>\n\n")
    f.write("int main() {\n")
    f.write("    std::vector<std::string> readme_lines = {\n")
    for line in clean_lines:
        safe_line = line.replace('"', '\\"')
        f.write(f"        \"{safe_line}\",\n")
    f.write("    };\n\n")
    f.write('    std::cout << "==== VALORAI2E-V2.0 README RECODE IN C++ ====" << std::endl;\n\n')
    f.write("    for (const auto& line : readme_lines) {\n")
    f.write("        if (!line.empty()) {\n")
    f.write("            std::cout << line << std::endl;\n")
    f.write("        }\n")
    f.write("    }\n\n")
    f.write("    return 0;\n")
    f.write("}\n")

# 5. Write README.f90 (Root)
with open("README.f90", "w") as f:
    f.write("program valorai2e_v20_readme\n")
    f.write("    implicit none\n\n")
    f.write(f"    integer, parameter :: max_lines = {len(clean_lines)}\n")
    f.write("    character(len=255) :: readme_lines(max_lines)\n")
    f.write("    integer :: i\n\n")
    for i, line in enumerate(clean_lines):
        safe_line = line.replace('"', "'")
        if len(safe_line) > 250: safe_line = safe_line[:250]
        f.write(f"    readme_lines({i+1}) = \"{safe_line}\"\n")
    f.write("\n    do i = 1, max_lines\n")
    f.write("        if (len_trim(readme_lines(i)) > 0) then\n")
    f.write("            print *, trim(readme_lines(i))\n")
    f.write("        end if\n")
    f.write("    end do\n\n")
    f.write("end program valorai2e_v20_readme\n")

print("Artifacts generated successfully.")
