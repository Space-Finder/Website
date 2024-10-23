-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_from_teacher_id_fkey" FOREIGN KEY ("from_teacher_id") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_to_teacher_id_fkey" FOREIGN KEY ("to_teacher_id") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
