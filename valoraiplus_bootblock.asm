; valoraiplus_bootblock.asm
SECTION .data
valoraiplus_bios_banner db 'VALORAIPLUS OS - Secure Boot Block 0',0
valoraiplus_block_0_hash db '000000000019d6689c...',0
valoraiplus_gillson_root db '<INSERT_GILLSON_ROOT>',0

SECTION .text
global _start
_start:
    mov edx, valoraiplus_bios_banner
    call print_string  ; custom routine for console
    ; Continue boot with hash+root anchoring...