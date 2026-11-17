"use client";

import { useRepos } from "@/components/ReposProvider";
import { curatedProject } from "@/lib/data";
import { findRepo } from "@/lib/repos";

/** 固定文案里的项目引用也从实时仓库数据读取名称。 */
export function ProjectName({ name }: { name: string }) {
  const { repos } = useRepos();
  return (
    <>{findRepo(repos, name)?.name ?? curatedProject(name)?.name ?? name}</>
  );
}
