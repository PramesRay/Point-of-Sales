import os
import re
import glob

def clean_console_logs(dir_path):
    vue_files = glob.glob(os.path.join(dir_path, '**/*.vue'), recursive=True)
    ts_files = glob.glob(os.path.join(dir_path, '**/*.ts'), recursive=True)
    
    files_to_check = vue_files + ts_files
    
    count = 0
    for file_path in files_to_check:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Replace console.log(error) with console.error(error) in catch blocks or generally
        # But wait, replacing console.log('...') with nothing or commenting it out is better for debug statements
        
        # We will comment out console.log(...) 
        # that are not already commented out
        # regex to match: \s+console.log(...) that does not have // before it
        # Actually, simpler: replace console.log(error) with console.error(error)
        new_content = re.sub(r'(?<!//\s)(?<!//)console\.log\(error\)', r'console.error(error)', content)
        
        # For other console.log statements, let's comment them out
        # Match lines with console.log(...) that are not already commented out
        new_content = re.sub(r'^(\s*)console\.log\((.*?)\)', r'\1// console.log(\2)', new_content, flags=re.MULTILINE)
        
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            count += 1
            print(f"Cleaned {file_path}")
            
    print(f"Cleaned {count} files.")

if __name__ == '__main__':
    clean_console_logs('src')
