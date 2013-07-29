extract_switches
extract_subroutines
live_registers
subroutines.each({
	cfg_traverse*2
	fixup_call_arguments
	build_ssa
})

live_registers_imports
subroutines.each({
	propagate_constants
	extract_variables
	extract_structures
}